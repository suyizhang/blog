'use client';

import { useEffect, useState } from 'react';
import { Table, Space, Button, Input, Modal, Checkbox, Form, message } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const permissionOptions = [
  { label: '创建文章', value: 'create_post' },
  { label: '编辑文章', value: 'edit_post' },
  { label: '删除文章', value: 'delete_post' },
  { label: '管理用户', value: 'manage_users' },
  { label: '管理角色', value: 'manage_roles' },
  { label: '管理设置', value: 'manage_settings' }
];

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [error]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      } else {
        message.error('获取角色列表失败');
      }
    } catch (error: any) {
      message.error('获取角色列表失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个角色吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/roles/${id}`, {
            method: 'DELETE'
          });
          const data = await response.json();
          if (data.success) {
            message.success('角色删除成功');
            fetchRoles();
          } else {
            message.error(data.message || '删除角色失败');
          }
        } catch (error: any) {
          message.error('删除角色失败：' + error.message);
        }
      }
    });
  };

  const showPermissionModal = (role: Role) => {
    setCurrentRole(role);
    setSelectedPermissions(role.permissions);
    setPermissionModalVisible(true);
  };

  const handlePermissionSave = async () => {
    if (!currentRole) return;

    try {
      const response = await fetch(`/api/admin/roles/${currentRole.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          permissions: selectedPermissions
        })
      });

      const data = await response.json();
      if (data.success) {
        message.success('权限更新成功');
        setPermissionModalVisible(false);
        fetchRoles();
      } else {
        message.error(data.message || '更新权限失败');
      }
    } catch (error: any) {
      message.error('更新权限失败：' + error.message);
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/admin/roles/edit/${record.id}`}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={() => showPermissionModal(record)}
          >
            权限
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
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索角色"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => window.location.href = '/admin/roles/new'}>
            新建角色
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredRoles}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="设置权限"
        open={permissionModalVisible}
        onOk={handlePermissionSave}
        onCancel={() => setPermissionModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="权限列表">
            <Checkbox.Group
              options={permissionOptions}
              value={selectedPermissions}
              onChange={(checkedValues) => setSelectedPermissions(checkedValues as string[])}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}