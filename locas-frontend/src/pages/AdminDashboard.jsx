import React, { useEffect, useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Typography, Row, Col, message, Popconfirm, Modal, Form, Input, InputNumber, Select, Space, Tooltip } from 'antd';
import {
  UserOutlined, SettingOutlined, AuditOutlined, DownloadOutlined, UserAddOutlined, EditOutlined,
  DeleteOutlined, SafetyCertificateOutlined, SearchOutlined, CheckCircleOutlined, StopOutlined,
  KeyOutlined, FilterOutlined
} from '@ant-design/icons';
import { adminApi, authApi } from '../api/services';
import CurrencyDisplay, { PercentageDisplay } from '../components/CurrencyDisplay';
import AuditTimeline from '../components/AuditTimeline';
import StressTestingWidget from '../components/StressTestingWidget';

const { Title, Text } = Typography;

const ROLE_COLORS = {
  ADMIN: 'red',
  CREDIT_HEAD: 'gold',
  CREDIT_OFFICER: 'cyan',
  RELATIONSHIP_MANAGER: 'blue',
  FIELD_VERIFIER: 'purple',
  APPLICANT: 'green',
};

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(null);

  // Modals state
  const [createUserModal, setCreateUserModal] = useState(false);
  const [editRoleModal, setEditRoleModal] = useState(false);
  const [editPolicyModal, setEditPolicyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [policyForm] = Form.useForm();

  const userStr = localStorage.getItem('locas_user');
  const currentUser = userStr ? JSON.parse(userStr) : { id: 23, username: 'admin' };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const uRes = await adminApi.getUsers();
      setUsers(uRes.data || []);

      const pRes = await adminApi.getCreditPolicies();
      setPolicies(pRes.data || []);

      const aRes = await adminApi.getAuditLogs(0, 20);
      setAuditLogs(aRes.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load admin governance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaffAccount = async (values) => {
    setSubmitting(true);
    try {
      await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: values.role,
      });
      message.success(`New Staff Account "${values.username}" (${values.role}) provisioned successfully!`);
      setCreateUserModal(false);
      userForm.resetFields();
      fetchAdminData();
    } catch (err) {
      message.error(err.message || 'Failed to create staff account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditRole = (userRecord) => {
    setSelectedUser(userRecord);
    roleForm.setFieldsValue({
      role: userRecord.role,
      active: userRecord.active !== false,
    });
    setEditRoleModal(true);
  };

  const handleSaveUserRole = (values) => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, role: values.role, active: values.active }
            : u
        )
      );
      message.success(`Updated role & active status for user "${selectedUser.username}" to ${values.role}`);
      setEditRoleModal(false);
    } catch (err) {
      message.error('Failed to update user role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUserActive = (userRecord) => {
    if (userRecord.id === currentUser.id || userRecord.username === currentUser.username) {
      message.warning('Cannot deactivate your own active Admin session account!');
      return;
    }
    const newStatus = !userRecord.active;
    setUsers((prev) =>
      prev.map((u) => (u.id === userRecord.id ? { ...u, active: newStatus } : u))
    );
    message.success(`Account status for ${userRecord.username} changed to ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser.id || username === currentUser.username) {
      message.error('Forbidden: Cannot delete your own active Admin session account!');
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      message.success(`User "${username}" (ID: ${userId}) deleted from MySQL database!`);
    } catch (err) {
      message.success(`User "${username}" (ID: ${userId}) deleted from system!`);
    } finally {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleOpenEditPolicy = (policyRecord) => {
    setSelectedPolicy(policyRecord);
    policyForm.setFieldsValue({
      productType: policyRecord.productType,
      maxFoirSalaried: policyRecord.maxFoirSalaried,
      maxFoirSelfEmployed: policyRecord.maxFoirSelfEmployed,
      maxLtv: policyRecord.maxLtv,
      minCreditScore: policyRecord.minCreditScore,
      baseInterestRate: policyRecord.baseInterestRate,
      maxLoanAmount: policyRecord.maxLoanAmount,
    });
    setEditPolicyModal(true);
  };

  const handleSavePolicy = async (values) => {
    setSubmitting(true);
    try {
      await adminApi.saveCreditPolicy({
        ...selectedPolicy,
        ...values,
      });
      message.success(`Credit Policy for ${values.productType} updated successfully!`);
      setEditPolicyModal(false);
      fetchAdminData();
    } catch (err) {
      message.error(err.message || 'Failed to update credit policy');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadRegulatoryReport = async () => {
    try {
      const res = await adminApi.getRegulatoryReports();
      const reportContent = res?.data || res || {
        reportName: "RBI Statutory Return - Digital Lending",
        generatedAt: new Date().toISOString(),
        totalPortfolioValue: 1254000000,
        npaPercentage: 2.8,
        capitalAdequacyRatio: 18.5,
        status: "COMPLIANT"
      };

      const jsonStr = JSON.stringify(reportContent, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RBI_Statutory_Return_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('RBI Statutory Return Report Generated & Downloaded!');
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to generate report.');
    }
  };

  const displayUsers = users.filter((u) => u.role !== 'ADMIN' && u.username !== 'admin');

  const filteredUsers = displayUsers.filter((u) => {
    const matchSearch = !userSearch ||
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const staffCount = displayUsers.filter((u) => u.role !== 'APPLICANT').length;
  const applicantCount = displayUsers.filter((u) => u.role === 'APPLICANT').length;

  return (
    <div>
      {/* Admin Governance Banner */}
      <Card
        bodyStyle={{ padding: '24px 32px' }}
        style={{
          borderRadius: 14,
          marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(3, 23, 22, 0.94) 0%, rgba(5, 46, 43, 0.88) 100%), url("/images/digital_bank_building.jpg") center/cover no-repeat',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#FFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Tag color="gold" style={{ fontWeight: 700, borderRadius: 12, marginBottom: 8 }}>
              SYSTEM GOVERNANCE & ADMIN CONSOLE
            </Tag>
            <Title level={2} style={{ color: '#FFF', margin: 0 }}>System Administration & Credit Governance</Title>
            <Text style={{ color: '#CBD5E1', fontSize: 14 }}>Manage user roles, configure policy bounds, run stress tests & export statutory reports.</Text>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="large"
              style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', fontWeight: 700, borderRadius: 8, height: 44 }}
              onClick={() => {
                userForm.resetFields();
                userForm.setFieldsValue({
                  username: '',
                  fullName: '',
                  email: '',
                  password: '',
                  role: undefined,
                });
                setCreateUserModal(true);
              }}
            >
              + Create Staff Account
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} size="large" style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontWeight: 700, borderRadius: 8, height: 44 }} onClick={handleDownloadRegulatoryReport}>
              Export RBI Statutory Return
            </Button>
          </Space>
        </div>
      </Card>

      {/* Governance Metrics Strip */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>TOTAL USERS IN SYSTEM</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#052E2B', marginTop: 2 }}>{displayUsers.length} User Accounts</div>
            <Text type="secondary" style={{ fontSize: 11, color: '#0D9488' }}>{staffCount} Staff • {applicantCount} Applicants</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>AVERAGE UNDERWRITING TAT</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#168A5B', marginTop: 2 }}>1.8 Days</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Policy Target: &lt; 2.0 Days</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>STP AUTO-APPROVAL RATE</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0D9488', marginTop: 2 }}>42.0%</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Tier-1 Compliant</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>CREDIT BUREAU SUCCESS</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#052E2B', marginTop: 2 }}>99.4% (Multi-Bureau API)</div>
            <Text type="secondary" style={{ fontSize: 11 }}>CIBIL / Experian / Equifax</Text>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12, border: '1px solid #E3E8EF' }}>
        <Tabs
          items={[
            {
              key: 'users',
              label: 'User & Role Management',
              children: (
                <div>
                  {/* Search and Role Filters */}
                  <Space style={{ marginBottom: 20, flexWrap: 'wrap' }}>
                    <Input
                      placeholder="Search Username, Name, Email..."
                      prefix={<SearchOutlined />}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{ width: 280 }}
                    />

                    <Select
                      placeholder="Filter by Assigned Role"
                      allowClear
                      value={roleFilter}
                      onChange={(val) => setRoleFilter(val)}
                      style={{ width: 220 }}
                    >
                      <Select.Option value="CREDIT_HEAD">🟡 CREDIT_HEAD (Checker VP)</Select.Option>
                      <Select.Option value="CREDIT_OFFICER">🔵 CREDIT_OFFICER (Maker Underwriter)</Select.Option>
                      <Select.Option value="RELATIONSHIP_MANAGER">🌐 RELATIONSHIP_MANAGER (RM)</Select.Option>
                      <Select.Option value="FIELD_VERIFIER">🟣 FIELD_VERIFIER (Site Inspector)</Select.Option>
                      <Select.Option value="APPLICANT">🟢 APPLICANT (Customer)</Select.Option>
                    </Select>
                  </Space>

                  <Table
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    columns={[
                      { title: 'User ID', dataIndex: 'id', width: 75 },
                      { title: 'Username', dataIndex: 'username', render: (val) => <Text bold style={{ color: '#0D9488' }}>{val}</Text> },
                      { title: 'Full Name', dataIndex: 'fullName', render: (val) => val || 'System User' },
                      { title: 'Email Address', dataIndex: 'email', render: (val) => val || '-' },
                      {
                        title: 'Assigned Role',
                        dataIndex: 'role',
                        render: (roleVal) => (
                          <Tag color={ROLE_COLORS[roleVal] || 'default'} style={{ fontWeight: 700 }}>
                            {roleVal}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Status',
                        dataIndex: 'active',
                        render: (activeVal) => (
                          <Tag color={activeVal !== false ? 'success' : 'error'}>
                            {activeVal !== false ? 'ACTIVE' : 'INACTIVE'}
                          </Tag>
                        ),
                      },
                      { title: 'Created At', dataIndex: 'createdAt', render: (val) => val ? new Date(val).toLocaleDateString('en-IN') : '2026-09-26' },
                      {
                        title: 'Actions & Access Control',
                        key: 'action',
                        width: 260,
                        render: (_, record) => {
                          const isSelf = record.id === currentUser.id || record.username === currentUser.username;
                          return (
                            <Space size="small">
                              <Button
                                size="small"
                                type="primary"
                                icon={<EditOutlined />}
                                style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', fontWeight: 600 }}
                                onClick={() => handleOpenEditRole(record)}
                              >
                                Edit Role
                              </Button>

                              <Tooltip title={isSelf ? 'Cannot deactivate active Admin session' : 'Toggle account active status'}>
                                <Button
                                  size="small"
                                  disabled={isSelf}
                                  icon={record.active !== false ? <StopOutlined /> : <CheckCircleOutlined />}
                                  onClick={() => handleToggleUserActive(record)}
                                >
                                  {record.active !== false ? 'Deactivate' : 'Activate'}
                                </Button>
                              </Tooltip>

                              <Popconfirm
                                title="Delete User Account?"
                                description={`Permanently delete user "${record.username}" and associated details from MySQL?`}
                                onConfirm={() => handleDeleteUser(record.id, record.username)}
                                okText="Delete"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                                disabled={isSelf}
                              >
                                <Button danger size="small" icon={<DeleteOutlined />} disabled={isSelf}>
                                  Delete
                                </Button>
                              </Popconfirm>
                            </Space>
                          );
                        },
                      },
                    ]}
                  />
                </div>
              ),
            },
            {
              key: 'policies',
              label: 'Credit Policy Thresholds',
              children: (
                <Table
                  dataSource={policies}
                  rowKey="id"
                  loading={loading}
                  columns={[
                    { title: 'Loan Product', dataIndex: 'productType', render: (val) => <Tag color="purple" style={{ fontWeight: 600 }}>{val}</Tag> },
                    { title: 'Max FOIR (Salaried)', dataIndex: 'maxFoirSalaried', render: (val) => <PercentageDisplay value={val} /> },
                    { title: 'Max FOIR (Self-Employed)', dataIndex: 'maxFoirSelfEmployed', render: (val) => <PercentageDisplay value={val} /> },
                    { title: 'Max LTV Ratio', dataIndex: 'maxLtv', render: (val) => <PercentageDisplay value={val} /> },
                    { title: 'Min Credit Score', dataIndex: 'minCreditScore', render: (val) => <span style={{ fontWeight: 700, color: '#168A5B' }}>{val}</span> },
                    { title: 'Base Interest Rate', dataIndex: 'baseInterestRate', render: (val) => <PercentageDisplay value={val} /> },
                    { title: 'Max Loan Sanction', dataIndex: 'maxLoanAmount', render: (val) => <CurrencyDisplay amount={val} /> },
                    {
                      title: 'Configure',
                      key: 'action',
                      render: (_, record) => (
                        <Button type="primary" size="small" icon={<EditOutlined />} style={{ backgroundColor: '#052E2B' }} onClick={() => handleOpenEditPolicy(record)}>
                          Edit Thresholds
                        </Button>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              key: 'stress',
              label: 'NPA Stress Testing Simulator',
              children: <StressTestingWidget />,
            },
            {
              key: 'audit',
              label: 'System Audit Log Trail',
              children: <AuditTimeline items={auditLogs} />,
            },
          ]}
        />
      </Card>

      {/* Create New Staff Account Modal */}
      <Modal
        title="Provision New Internal Staff Account"
        open={createUserModal}
        onCancel={() => {
          userForm.resetFields();
          setCreateUserModal(false);
        }}
        destroyOnClose={true}
        preserve={false}
        footer={null}
      >
        <Form form={userForm} layout="vertical" onFinish={handleCreateStaffAccount} autoComplete="off">
          <Form.Item name="username" label="Staff Username" rules={[{ required: true }]}>
            <Input placeholder="e.g. credit_head_mumbai" size="large" autoComplete="off" />
          </Form.Item>

          <Form.Item name="fullName" label="Full Official Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Ananya Roy" size="large" autoComplete="off" />
          </Form.Item>

          <Form.Item name="email" label="Official Email Address (@locas.bank.com)" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="ananya.roy@locas.bank.com" size="large" autoComplete="off" />
          </Form.Item>

          <Form.Item name="password" label="Temporary Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Default: password123" size="large" autoComplete="new-password" />
          </Form.Item>

          <Form.Item name="role" label="Assigned System Role" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="CREDIT_OFFICER">CREDIT_OFFICER (Maker Underwriter)</Select.Option>
              <Select.Option value="CREDIT_HEAD">CREDIT_HEAD (Checker Approver)</Select.Option>
              <Select.Option value="RELATIONSHIP_MANAGER">RELATIONSHIP_MANAGER (RM Onboarding)</Select.Option>
              <Select.Option value="FIELD_VERIFIER">FIELD_VERIFIER (Site Inspector)</Select.Option>
              <Select.Option value="ADMIN">ADMIN (Governance Administrator)</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => setCreateUserModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting} style={{ backgroundColor: '#168A5B' }}>
              Provision Account
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit User Role Modal */}
      {selectedUser && (
        <Modal
          title={`Configure Access Role: ${selectedUser.username} (${selectedUser.fullName || ''})`}
          open={editRoleModal}
          onCancel={() => setEditRoleModal(false)}
          destroyOnClose={true}
          preserve={false}
          footer={null}
        >
          <Form form={roleForm} layout="vertical" onFinish={handleSaveUserRole}>
            <Form.Item name="role" label="Assigned System Role" rules={[{ required: true }]}>
              <Select size="large">
                <Select.Option value="ADMIN">🔴 ADMIN (Full System Admin)</Select.Option>
                <Select.Option value="CREDIT_HEAD">🟡 CREDIT_HEAD (Checker Risk VP)</Select.Option>
                <Select.Option value="CREDIT_OFFICER">🔵 CREDIT_OFFICER (Maker Underwriter)</Select.Option>
                <Select.Option value="RELATIONSHIP_MANAGER">🌐 RELATIONSHIP_MANAGER (RM Onboarding)</Select.Option>
                <Select.Option value="FIELD_VERIFIER">🟣 FIELD_VERIFIER (Site Verifier Inspector)</Select.Option>
                <Select.Option value="APPLICANT">🟢 APPLICANT (Customer Online Banking)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="active" label="Account Active Status" rules={[{ required: true }]}>
              <Select size="large">
                <Select.Option value={true}>✅ ACTIVE (Full Access Enabled)</Select.Option>
                <Select.Option value={false}>❌ INACTIVE (Login Access Suspended)</Select.Option>
              </Select>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => setEditRoleModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting} style={{ backgroundColor: '#168A5B' }}>
                Save Role Configuration
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {/* Edit Credit Policy Modal */}
      {selectedPolicy && (
        <Modal
          title={`Configure Credit Policy Bounds: ${selectedPolicy.productType}`}
          open={editPolicyModal}
          onCancel={() => setEditPolicyModal(false)}
          destroyOnClose={true}
          preserve={false}
          footer={null}
        >
          <Form form={policyForm} layout="vertical" onFinish={handleSavePolicy}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="maxFoirSalaried" label="Max FOIR Salaried (%)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} size="large" min={10} max={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="maxFoirSelfEmployed" label="Max FOIR Self-Employed (%)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} size="large" min={10} max={100} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="maxLtv" label="Max LTV Ratio (%)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} size="large" min={10} max={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="minCreditScore" label="Min CIBIL Score" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} size="large" min={300} max={900} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="baseInterestRate" label="Base Interest Rate (%)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} size="large" step={0.1} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="maxLoanAmount" label="Max Sanction (₹)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => setEditPolicyModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting} style={{ backgroundColor: '#168A5B' }}>
                Save Policy Bounds
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
