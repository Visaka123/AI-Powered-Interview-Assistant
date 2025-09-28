import mammoth from 'mammoth';

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  text: string;
}

export const parseResume = async (file: File): Promise<ParsedResumeData> => {
  let text = '';
  
  if (file.type === 'application/pdf') {
    // For PDF parsing, we'll use a simple text extraction
    // In a real app, you'd use pdf-parse or similar library
    text = 'PDF parsing not implemented in demo - please use DOCX';
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    text = result.value;
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX file.');
  }

  // Extract information using regex patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  // Improved name extraction with debugging
  const lines = text.split('\n').filter(line => line.trim());
  let name = '';
  
  console.log('📄 Resume text lines:');
  lines.slice(0, 10).forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`);
  });
  
  // Look for specific name pattern first (VISAKA P format)
  for (const line of lines.slice(0, 5)) {
    const cleanLine = line.trim();
    
    // Handle lines with name and email combined
    if (cleanLine.includes('Email') || cleanLine.includes('@')) {
      // Extract name part before Email or @
      const beforeEmail = cleanLine.split(/Email|@/)[0].trim();
      if (/^[A-Z]{2,}\s+[A-Z]\s*$/.test(beforeEmail)) {
        name = beforeEmail;
        console.log('✅ Found name (from combined line):', name);
        break;
      }
    }
    
    // Direct match for VISAKA P pattern
    if (/^[A-Z]{2,}\s+[A-Z]\s*$/.test(cleanLine)) {
      name = cleanLine;
      console.log('✅ Found name (ALL CAPS):', name);
      break;
    }
  }
  
  // If not found, try other patterns
  if (!name) {
    for (const line of lines.slice(0, 10)) {
      const cleanLine = line.trim();
      
      // Skip obvious non-names
      const skipWords = ['resume', 'curriculum', 'cv', 'education', 'experience', 
                        'skills', 'projects', 'technical', 'programming', 'languages',
                        'frameworks', 'tools', 'contact', 'objective', 'summary', 'email',
                        'mobile', 'phone', 'linkedin', 'github'];
      
      if (skipWords.some(word => cleanLine.toLowerCase().includes(word)) ||
          cleanLine.length < 2 ||
          cleanLine.length > 50 ||
          cleanLine.includes('|') ||
          cleanLine.includes(':') ||
          cleanLine.includes('@') ||
          cleanLine.includes('+') ||
          cleanLine.includes('www') ||
          cleanLine.includes('.com')) {
        continue;
      }
      
      // Look for name patterns
      const namePatterns = [
        /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$/,  // First Last
        /^([A-Z][a-z]+\s+[A-Z])$/,  // First L
      ];
      
      for (const pattern of namePatterns) {
        const match = cleanLine.match(pattern);
        if (match) {
          name = match[1].trim();
          console.log('✅ Found name (pattern):', name);
          break;
        }
      }
      
      if (name) break;
    }
  }
  
  // Final fallback - use first line if it looks like a name
  if (!name && lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 1 && firstLine.length < 50 && 
        /^[A-Za-z\s]+$/.test(firstLine) &&
        !firstLine.toLowerCase().includes('resume')) {
      name = firstLine;
      console.log('🔄 Using first line as fallback:', name);
    }
  }
  
  console.log('🎯 Final extracted name:', name || 'Not found');

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);

  return {
    name: name || undefined,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    text
  };
};