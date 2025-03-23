'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useRouter } from 'next/navigation';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const permissionOptions = [
  { label: '创建文章', value: 'create_post' },
  { label: '编辑文章', value: 'edit_post' },
  { label: '删除文章', value: 'delete_post' },
  { label: '管理用户', value: 'manage_users' },
  { label: '管理角色', value: 'manage_roles' },
  { label: '管理设置', value: 'manage_settings' }
];

export default function EditRole({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/roles/${params.id}`);
      const data = await response.json();
      if (data.success) {
        form.setFieldsValue(data.data);
      } else {
        message.error('获取角色信息失败');
      }
    } catch (error: any) {
      message.error('获取角色信息失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Role) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/roles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();
      if (data.success) {
        message.success('角色更新成功');
        router.push('/admin/roles');
      } else {
        message.error(data.message || '更新角色失败');
      }
    } catch (error: any) {
      message.error('更新角色失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">编辑角色</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="角色描述"
          rules={[{ required: true, message: '请输入角色描述' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="permissions"
          label="权限列表"
          rules={[{ required: true, message: '请选择至少一个权限' }]}
        >
          <Checkbox.Group options={permissionOptions} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => router.push('/admin/roles')}
          >
            返回
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}