import React, { useState } from 'react';
import { Upload, Button, message, Form, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { parseResume, ParsedResumeData } from '../utils/resumeParser';

const { Dragger } = Upload;

interface ResumeUploadProps {
  onComplete: (data: { name: string; email: string; phone: string; file: File }) => void;
  darkMode?: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onComplete, darkMode = false }) => {
  const [form] = Form.useForm();
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const data = await parseResume(file);
      setParsedData(data);
      setUploadedFile(file);
      
      // Pre-fill form with extracted data
      form.setFieldsValue({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || ''
      });
      
      message.success('Resume uploaded and parsed successfully!');
    } catch (error) {
      message.error('Failed to parse resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values: { name: string; email: string; phone: string }) => {
    if (!uploadedFile) {
      message.error('Please upload a resume first.');
      return;
    }
    
    onComplete({
      ...values,
      file: uploadedFile
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.docx',
    beforeUpload: (file: File) => {
      handleFileUpload(file);
      return false; // Prevent automatic upload
    },
    showUploadList: false
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: '0 auto', 
      padding: '20px',
      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: darkMode ? '1px solid rgba(71, 85, 105, 0.3)' : '1px solid rgba(226, 232, 240, 0.3)'
    }}>
      <h2 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Upload Your Resume</h2>
      
      <Dragger {...uploadProps} style={{ 
        marginBottom: 24,
        background: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 0.8)',
        border: darkMode ? '2px dashed #64748b' : '2px dashed #cbd5e1',
        borderRadius: '12px'
      }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p style={{ 
          color: darkMode ? '#f1f5f9' : '#1e293b',
          fontSize: '16px',
          fontWeight: 600,
          margin: '16px 0 8px 0'
        }}>
          Click or drag resume to this area to upload
        </p>
        <p style={{ 
          color: darkMode ? '#cbd5e1' : '#64748b',
          fontSize: '14px',
          margin: '8px 0 16px 0'
        }}>
          Support for PDF and DOCX files. We'll extract your contact information automatically.
        </p>
      </Dragger>

      {parsedData && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Start Interview
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ResumeUpload;