import React, { useEffect } from 'react';
import { Layout, Tabs, Typography, Dropdown, Badge, Modal, Button, List, Avatar, Switch } from 'antd';
import { UserOutlined, DashboardOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { setActiveTab, setShowWelcomeBack } from './store/uiSlice';
import { startInterview } from './store/interviewSlice';
import { createCandidate } from './store/candidatesSlice';
import ResumeUpload from './components/ResumeUpload';
import InterviewChat from './components/InterviewChat';
import InterviewerDashboard from './components/InterviewerDashboard';
// import WelcomeBackModal from './components/WelcomeBackModal';

import { Candidate } from './types';
import { v4 as uuidv4 } from 'uuid';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const { currentCandidate, isInterviewActive } = useSelector((state: RootState) => state.interview);
  const candidates = useSelector((state: RootState) => state.candidates.candidates);
  const [notificationVisible, setNotificationVisible] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);
  const [notificationsRead, setNotificationsRead] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [aiGeneration, setAiGeneration] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);

  useEffect(() => {
    // Check for unfinished interview on app load
    if (currentCandidate && isInterviewActive) {
      dispatch(setShowWelcomeBack(true));
    }
  }, [currentCandidate, isInterviewActive, dispatch]);

  const handleResumeComplete = async (data: { name: string; email: string; phone: string; file: File }) => {
    const candidateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      resumeText: data.file.name,
      score: 0,
      summary: '',
      status: 'in-progress' as const,
      answers: [],
      currentQuestionIndex: 0
    };

    console.log('🚀 Creating candidate with data:', candidateData);
    const result = await dispatch(createCandidate(candidateData));
    const candidate = result.payload;
    console.log('💾 Backend returned candidate:', candidate);
    console.log('🎯 Starting interview with candidate ID:', candidate._id || candidate.id);
    dispatch(startInterview(candidate));
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px 28px',
          color: '#475569',
          fontWeight: 700,
          fontSize: '16px'
        }}>
          <UserOutlined style={{ fontSize: '20px', color: '#4f46e5' }} />
          <span>Take Interview</span>
        </span>
      ),
      children: (
        <div style={{ 
          padding: '40px',
          background: 'transparent',
          minHeight: 'calc(100vh - 140px)'
        }}>
          {!isInterviewActive ? (
            <ResumeUpload onComplete={handleResumeComplete} darkMode={darkMode} />
          ) : (
            <InterviewChat />
          )}
        </div>
      )
    },
    {
      key: 'interviewer',
      label: (
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px 28px',
          color: '#475569',
          fontWeight: 700,
          fontSize: '16px'
        }}>
          <DashboardOutlined style={{ fontSize: '20px', color: '#059669' }} />
          <span>Analytics Dashboard</span>
        </span>
      ),
      children: (
        <div style={{ 
          padding: '40px',
          background: 'transparent',
          minHeight: 'calc(100vh - 140px)'
        }}>
          <InterviewerDashboard />
        </div>
      )
    }
  ];

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
    }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
        padding: '0 48px', 
        height: '100px',
        boxShadow: '0 20px 60px rgba(79, 70, 229, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, minWidth: 0, zIndex: 2 }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
            border: '2px solid rgba(255,255,255,0.8)',
            position: 'relative'
          }}>
            <div style={{
              color: '#4f46e5',
              fontSize: '28px',
              fontWeight: 'bold'
            }}>AI</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              margin: 0, 
              color: '#fff', 
              fontWeight: 900,
              fontSize: '36px',
              letterSpacing: '-1.5px',
              whiteSpace: 'nowrap',
              textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              InterviewAI 
              <span style={{
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none'
              }}>Pro</span>
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '16px',
              fontWeight: 600,
              marginTop: '6px',
              whiteSpace: 'nowrap',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Revolutionary AI-Powered Interview Platform
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
          <Badge count={notificationsRead ? 0 : candidates.length} size="small">
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} onClick={() => {
              setNotificationVisible(true);
              setNotificationsRead(true);
            }}>
              <BellOutlined style={{ fontSize: '20px', color: '#fff' }} />
            </div>
          </Badge>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            padding: '10px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} onClick={() => setSettingsVisible(true)}>
            <SettingOutlined style={{ fontSize: '20px', color: '#fff' }} />
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  label: 'View Profile',
                  icon: <UserOutlined />,
                  onClick: () => setProfileVisible(true)
                },
                {
                  key: 'settings',
                  label: 'Settings',
                  icon: <SettingOutlined />,
                  onClick: () => setSettingsVisible(true)
                },
                { type: 'divider' },
                {
                  key: 'logout',
                  label: 'Logout',
                  icon: <LogoutOutlined />,
                  onClick: () => Modal.confirm({
                    title: 'Logout Confirmation',
                    content: 'Are you sure you want to logout?',
                    onOk: () => window.location.reload()
                  })
                }
              ]
            }}
            trigger={['click']}
          >
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              padding: '6px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '10px',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>VP</div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>VISAKA P</div>
            </div>
          </Dropdown>
        </div>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
      </Header>
      
      <Content style={{ display: 'flex' }}>
        {!isInterviewActive && (
        <div style={{
          width: '280px',
          background: darkMode 
            ? 'linear-gradient(180deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderRight: darkMode ? '2px solid #475569' : '2px solid #e2e8f0',
          padding: '32px 24px',
          boxShadow: '4px 0 16px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 700, 
              color: darkMode ? '#f1f5f9' : '#1e293b',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'interviewee' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                color: activeTab === 'interviewee' ? '#fff' : (darkMode ? '#cbd5e1' : '#64748b'),
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
              }} onClick={() => dispatch(setActiveTab('interviewee'))}>
                <UserOutlined style={{ fontSize: '16px' }} />
                Interview Portal
              </div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'interviewer' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
                color: activeTab === 'interviewer' ? '#fff' : (darkMode ? '#cbd5e1' : '#64748b'),
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
              }} onClick={() => dispatch(setActiveTab('interviewer'))}>
                <DashboardOutlined style={{ fontSize: '16px' }} />
                Analytics Hub
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#1e293b',
              marginBottom: '12px'
            }}>Quick Stats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #ddd6fe, #e0e7ff)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #c7d2fe'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#4338ca' }}>{candidates.length}</div>
                <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 500 }}>Total Interviews</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #86efac'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#15803d' }}>
                  {candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length) : 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>Avg Score</div>
              </div>
            </div>
          </div>
        </div>
        )}
        <div style={{ flex: 1 }}>
          {!isInterviewActive && (
          <div style={{
            background: '#fff',
            padding: '24px 32px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                {activeTab === 'interviewee' ? 'Interview Portal' : 'Analytics Dashboard'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                {activeTab === 'interviewee' ? 'Take your AI-powered technical interview' : 'Monitor and analyze interview performance'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #bbf7d0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#15803d'
              }}>
                System Online
              </div>
            </div>
          </div>
          )}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => dispatch(setActiveTab(key as 'interviewee' | 'interviewer'))}
          items={tabItems}
          style={{ 
            height: '100%',
            background: 'transparent'
          }}
          tabBarStyle={{
            display: 'none'
          }}
        />
        </div>
      </Content>

      {/* <WelcomeBackModal /> */}
      
      {/* Notifications Modal */}
      <Modal
        title={<span><BellOutlined /> Notifications</span>}
        open={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        footer={null}
        width={500}
      >
        <List
          dataSource={[
            ...candidates.slice().reverse().map((candidate, index) => {
              const now = new Date();
              const candidateDate = new Date(candidate.createdAt || candidate.completedAt || now);
              const diffMs = now.getTime() - candidateDate.getTime();
              const diffMins = Math.floor(diffMs / (1000 * 60));
              
              let timeAgo;
              if (diffMins < 1) {
                timeAgo = 'Just now';
              } else if (diffMins < 60) {
                timeAgo = `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
              } else {
                const diffHours = Math.floor(diffMins / 60);
                timeAgo = `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
              }
              
              return {
                title: 'Interview Completed',
                description: `${candidate.name} scored ${candidate.score}% in their technical interview`,
                time: timeAgo,
                type: 'success'
              };
            }),
            {
              title: 'System Status',
              description: `${candidates.length} total interviews conducted with AI evaluation`,
              time: '5 minutes ago',
              type: 'info'
            },
            {
              title: 'Analytics Update',
              description: `Average score: ${candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length) : 0}%`,
              time: '10 minutes ago',
              type: 'info'
            }
          ]}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ 
                  background: item.type === 'success' ? '#10b981' : '#3b82f6' 
                }}>{item.type === 'success' ? '✓' : 'i'}</Avatar>}
                title={item.title}
                description={item.description}
              />
              <div style={{ fontSize: '12px', color: '#64748b' }}>{item.time}</div>
            </List.Item>
          )}
        />
      </Modal>

      {/* Settings Modal */}
      <Modal
        title={<span><SettingOutlined /> Settings</span>}
        open={settingsVisible}
        onCancel={() => setSettingsVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSettingsVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => {
            Modal.success({
              title: 'Settings Saved',
              content: 'All settings have been saved successfully!'
            });
            setSettingsVisible(false);
          }}>
            Save Changes
          </Button>
        ]}
        width={600}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h4>Interview Settings</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Enable AI Question Generation</span>
              <Switch 
                checked={aiGeneration} 
                onChange={(checked) => {
                  setAiGeneration(checked);
                  Modal.success({
                    title: 'Setting Updated',
                    content: `AI Question Generation ${checked ? 'enabled' : 'disabled'}`
                  });
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Auto-save Interview Progress</span>
              <Switch 
                checked={autoSave} 
                onChange={(checked) => {
                  setAutoSave(checked);
                  Modal.success({
                    title: 'Setting Updated',
                    content: `Auto-save ${checked ? 'enabled' : 'disabled'}`
                  });
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Send Email Notifications</span>
              <Switch 
                checked={emailNotifications} 
                onChange={(checked) => {
                  setEmailNotifications(checked);
                  Modal.success({
                    title: 'Setting Updated',
                    content: `Email notifications ${checked ? 'enabled' : 'disabled'}`
                  });
                }}
              />
            </div>
          </div>
          <div>
            <h4>System Preferences</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Dark Mode</span>
              <Switch 
                checked={darkMode} 
                onChange={(checked) => {
                  setDarkMode(checked);
                  Modal.success({
                    title: 'Theme Updated',
                    content: `${checked ? 'Dark' : 'Light'} mode activated successfully!`
                  });
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>High Contrast Mode</span>
              <Switch 
                checked={highContrast} 
                onChange={(checked) => {
                  setHighContrast(checked);
                  Modal.info({
                    title: 'Accessibility',
                    content: `High contrast mode ${checked ? 'enabled' : 'disabled'}`
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        title={<span><UserOutlined /> User Profile</span>}
        open={profileVisible}
        onCancel={() => setProfileVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
            color: '#fff',
            fontWeight: 'bold'
          }}>VP</div>
          <h3>VISAKA P</h3>
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>Professional User</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Email:</span>
            <span>visakavisaka2705@gmail.com</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Role:</span>
            <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600
            }}>User</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Last Login:</span>
            <span>Today, 2:30 PM</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Interviews Conducted:</span>
            <span>{candidates.length}</span>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default App;