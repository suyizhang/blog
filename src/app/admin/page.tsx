'use client';

import { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { UserOutlined, FileOutlined, DashboardOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
    path: '/admin'
  },
  {
    key: 'posts',
    icon: <FileOutlined />,
    label: '文章管理',
    path: '/admin/posts'
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: '用户管理',
    path: '/admin/users'
  },
  {
    key: 'roles',
    icon: <TeamOutlined />,
    label: '角色管理',
    path: '/admin/roles'
  }
];

export default function AdminLayout() {
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['dashboard']);
  const { token } = theme.useToken();

  useEffect(() => {
    const currentKey = menuItems.find(item => pathname.startsWith(item.path))?.key || 'dashboard';
    setSelectedKeys([currentKey]);
  }, [pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', background: token.colorBgContainer }}>
        <div style={{ float: 'left', width: '120px', height: '31px', margin: '16px 24px 16px 0', background: 'rgba(0, 0, 0, 0.2)' }} />
        <h1 style={{ margin: 0, color: token.colorTextHeading }}>博客管理系统</h1>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: token.colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link href={item.path}>{item.label}</Link>
            }))}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius
          }}>
            {/* 子页面内容将在这里渲染 */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}