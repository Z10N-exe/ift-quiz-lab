-- Check what difficulty levels are allowed
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'questions' AND column_name = 'difficulty_level';

-- Clear existing questions and add sample questions with correct difficulty levels
DELETE FROM questions;

-- IFT 212.2 - Computer Architecture Questions
INSERT INTO questions (course_code, question_text, option_a, option_b, option_c, option_d, correct_answer, topic, difficulty_level) VALUES 

-- Flip-Flops Questions
('IFT212.2', 'What is the primary function of a flip-flop in digital circuits?', 'Amplify signals', 'Store one bit of data', 'Convert analog to digital', 'Perform arithmetic operations', 'B', 'Flip-Flops', 'easy'),
('IFT212.2', 'In an SR flip-flop, what happens when both S and R inputs are HIGH?', 'Output becomes 0', 'Output becomes 1', 'Invalid/forbidden state', 'Output toggles', 'C', 'Flip-Flops', 'medium'),
('IFT212.2', 'Which flip-flop changes its output state on every clock pulse when the input is HIGH?', 'SR flip-flop', 'D flip-flop', 'JK flip-flop', 'T flip-flop', 'D', 'Flip-Flops', 'easy'),
('IFT212.2', 'What does the D in D flip-flop stand for?', 'Digital', 'Delay', 'Data', 'Divide', 'C', 'Flip-Flops', 'easy'),
('IFT212.2', 'In a JK flip-flop, when J=1 and K=1, the output will:', 'Remain same', 'Become 0', 'Become 1', 'Toggle', 'D', 'Flip-Flops', 'medium'),

-- Modulation & Demodulation Questions  
('IFT212.2', 'What is modulation in communication systems?', 'Converting digital to analog', 'Mixing information signal with carrier wave', 'Amplifying signal strength', 'Filtering noise from signal', 'B', 'Modulation', 'easy'),
('IFT212.2', 'Which type of modulation varies the amplitude of the carrier wave?', 'FM - Frequency Modulation', 'PM - Phase Modulation', 'AM - Amplitude Modulation', 'PCM - Pulse Code Modulation', 'C', 'Modulation', 'easy'),
('IFT212.2', 'Demodulation is the process of:', 'Amplifying the modulated signal', 'Converting modulated signal back to original', 'Adding noise to the signal', 'Increasing signal frequency', 'B', 'Modulation', 'easy'),
('IFT212.2', 'In digital modulation, what does ASK stand for?', 'Amplitude Shift Keying', 'Analog Signal Key', 'Automatic System Key', 'Advanced Signal Key', 'A', 'Modulation', 'medium'),
('IFT212.2', 'Which modulation technique is most resistant to noise?', 'AM', 'FM', 'PM', 'Digital modulation', 'D', 'Modulation', 'hard'),

-- Computer Systems Questions
('IFT212.2', 'What is the primary function of the CPU in a computer system?', 'Store data permanently', 'Execute instructions and perform calculations', 'Display output to user', 'Connect to network', 'B', 'Computer Systems', 'easy'),
('IFT212.2', 'Which component acts as temporary storage for frequently accessed data?', 'Hard Drive', 'RAM', 'Cache Memory', 'ROM', 'C', 'Computer Systems', 'medium'),
('IFT212.2', 'What does ALU stand for in computer architecture?', 'Advanced Logic Unit', 'Arithmetic Logic Unit', 'Automatic Loading Unit', 'Application Logic Unit', 'B', 'Computer Systems', 'easy'),
('IFT212.2', 'In the fetch-decode-execute cycle, what happens during the decode phase?', 'Data is stored in memory', 'Instruction is interpreted', 'Result is displayed', 'Program counter increments', 'B', 'Computer Systems', 'medium'),
('IFT212.2', 'What type of memory is typically used for storing BIOS?', 'RAM', 'Cache', 'ROM', 'Virtual Memory', 'C', 'Computer Systems', 'easy');

-- IFT 235.2 - Mobile App Performance Optimization Questions
INSERT INTO questions (course_code, question_text, option_a, option_b, option_c, option_d, correct_answer, topic, difficulty_level) VALUES 

-- KPIs and Metrics Questions
('IFT235.2', 'What is the target crash-free session rate for a well-optimized mobile app?', 'Greater than 95%', 'Greater than 99.5%', 'Greater than 90%', 'Greater than 85%', 'B', 'KPIs', 'easy'),
('IFT235.2', 'ANR stands for:', 'Application Not Responding', 'Automatic Network Recovery', 'Advanced Network Routing', 'Application Network Request', 'A', 'KPIs', 'easy'),
('IFT235.2', 'What is considered an acceptable API response time for mobile applications?', 'Under 5 seconds', 'Under 2 seconds', 'Under 1 second', 'Under 500ms', 'D', 'KPIs', 'medium'),
('IFT235.2', 'Which metric measures how quickly an app becomes usable after launch?', 'Crash rate', 'App load time', 'Memory usage', 'Battery consumption', 'B', 'KPIs', 'easy'),
('IFT235.2', 'What is the recommended maximum app load time for good user experience?', '1 second', '2 seconds', '3 seconds', '5 seconds', 'B', 'KPIs', 'easy'),

-- Network Optimization Questions
('IFT235.2', 'Which technique reduces the number of network requests in mobile apps?', 'Code splitting', 'Request batching', 'Memory caching', 'CPU optimization', 'B', 'Network Optimization', 'medium'),
('IFT235.2', 'What is the benefit of using CDN for mobile applications?', 'Reduces server costs', 'Improves data loading speed', 'Increases app size', 'Simplifies code structure', 'B', 'Network Optimization', 'medium'),
('IFT235.2', 'Which HTTP method is most efficient for retrieving data?', 'POST', 'GET', 'PUT', 'DELETE', 'B', 'Network Optimization', 'easy'),
('IFT235.2', 'What is connection pooling in mobile app context?', 'Sharing database connections', 'Reusing HTTP connections', 'Combining multiple requests', 'Caching API responses', 'B', 'Network Optimization', 'hard'),
('IFT235.2', 'Which strategy helps reduce mobile data usage?', 'Image compression', 'Lazy loading', 'Response caching', 'All of the above', 'D', 'Network Optimization', 'medium'),

-- Data Processing Questions
('IFT235.2', 'What is the most efficient way to process large datasets on mobile?', 'Load all data at once', 'Process data in background threads', 'Use synchronous processing', 'Process on main UI thread', 'B', 'Data Processing', 'medium'),
('IFT235.2', 'Which data format is generally most efficient for mobile apps?', 'XML', 'JSON', 'CSV', 'Protocol Buffers', 'D', 'Data Processing', 'hard'),
('IFT235.2', 'What is pagination in mobile app context?', 'Loading data in smaller chunks', 'Organizing app screens', 'Managing user sessions', 'Optimizing images', 'A', 'Data Processing', 'easy'),
('IFT235.2', 'Which technique improves app responsiveness during data processing?', 'Synchronous operations', 'Asynchronous operations', 'Blocking UI updates', 'Disabling user input', 'B', 'Data Processing', 'medium'),
('IFT235.2', 'What is the primary benefit of data caching in mobile apps?', 'Reduces memory usage', 'Improves offline functionality', 'Increases app security', 'Simplifies code maintenance', 'B', 'Data Processing', 'medium');