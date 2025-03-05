'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Input, Tag, Modal, message } from 'antd';
import { Space } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostsManagement() {
  const [messageApi] = message.useMessage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      messageApi.error(error);
      setError(null);
    }
  }, [error, messageApi]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts);
      } else {
        setError('获取文章列表失败');
      }
    } catch (error: any) {
      setError('获取文章列表失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await fetch(`/api/blog/posts/${slug}`, {
            method: 'DELETE'
          });
          const data = await response.json();
          if (data.success) {
            messageApi.success('文章删除成功');
            fetchPosts();
          } else {
            setError(data.message || '删除文章失败');
          }
        } catch (error: any) {
          setError('删除文章失败：' + error.message);
        }
      }
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Post) => (
        <Link href={`/blog/${record.slug}`} target="_blank">{text}</Link>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => category || '-'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          )) || '-'}
        </>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Post) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/admin/posts/edit/${record.slug}`}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.slug)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchText.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchText.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchText.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索文章"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => window.location.href = '/admin/posts/new'}>
            新建文章
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="slug"
        loading={loading}
      />
    </div>
  );
}