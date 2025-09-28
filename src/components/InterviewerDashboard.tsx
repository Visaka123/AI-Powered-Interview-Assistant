import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Modal, Typography, Tag, Space, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidates } from '../store/candidatesSlice';
import { AppDispatch } from '../store';
import { RootState } from '../store';
import { Candidate } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

const InterviewerDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const candidates = useSelector((state: RootState) => state.candidates.candidates);
  
  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'createdAt'>('score');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      (candidate.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (candidate.email || '').toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Candidate) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag color={getScoreColor(score)}>
          {score}%
        </Tag>
      ),
      sorter: (a: Candidate, b: Candidate) => a.score - b.score
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Candidate) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCandidate(record);
            setDetailModalVisible(true);
          }}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Candidate Dashboard</Title>
          <Text type="secondary">
            Manage and review interview candidates
          </Text>
        </div>

        <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Input
            placeholder="Search candidates..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
          >
            <Option value="score">Sort by Score</Option>
            <Option value="createdAt">Sort by Date</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAndSortedCandidates}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Candidate Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Name">{selectedCandidate.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedCandidate.status)}>
                  {selectedCandidate.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Final Score">
                <Tag color={getScoreColor(selectedCandidate.score)}>
                  {selectedCandidate.score}%
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Interview Date">
                {new Date(selectedCandidate.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {selectedCandidate.summary && (
              <Card title="AI Summary" style={{ marginBottom: 24 }}>
                <Text>{selectedCandidate.summary}</Text>
              </Card>
            )}

            <Card title="Interview Questions & Answers">
              {selectedCandidate.answers.map((answer, index) => (
                <Card
                  key={`${selectedCandidate.id}-${answer.questionId}-${index}`}
                  type="inner"
                  title={`Question ${index + 1} (${answer.difficulty.toUpperCase()})`}
                  extra={
                    <Space>
                      <Tag color={getScoreColor((answer.score / 20) * 100)}>
                        Score: {answer.score}/20
                      </Tag>
                      <Text type="secondary">
                        Time: {Math.floor(answer.timeSpent / 60)}:{(answer.timeSpent % 60).toString().padStart(2, '0')}
                      </Text>
                    </Space>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Question:</Text>
                    <div style={{ marginTop: 4 }}>{answer.question}</div>
                  </div>
                  
                  <div>
                    <Text strong>Answer:</Text>
                    <div style={{ 
                      marginTop: 4, 
                      padding: 12, 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: 4,
                      minHeight: 40
                    }}>
                      {answer.answer || <Text type="secondary">No answer provided</Text>}
                    </div>
                  </div>
                </Card>
              ))}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewerDashboard;