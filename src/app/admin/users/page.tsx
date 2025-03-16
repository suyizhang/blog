'use client';

import { useEffect, useState } from 'react';
import { Table, Space, Button, Input, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [error]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/list');
      const data = await response.json();
      if (data.code === 200) {
        setUsers(data.data);
      } else {
        setError('获取用户列表失败');
      }
    } catch (error: any) {
      setError('获取用户列表失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await fetch(`/api/user/${id}`, {
            method: 'DELETE'
          });
          const data = await response.json();
          if (data.code === 200) {
            // messageApi.open({
            //   type: 'success',
            //   content: '用户删除成功'
            // });
            fetchUsers();
          } else {
            setError(data.message || '删除用户失败');
          }
        } catch (error: any) {
          setError('删除用户失败：' + error.message);
        }
      }
    });
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/admin/users/edit/${record.id}`}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索用户"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => window.location.href = '/admin/users/new'}>
            新建用户
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}