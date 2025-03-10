import styled, { keyframes } from 'styled-components';
import { color } from '@sb/webapp-core/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 100%;
  max-width: 900px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: ${color.skyBlueScale[500]};
  color: white;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const ModelSelector = styled.select`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const ModelOption = styled.option`
  color: #333;
  background-color: white;
`;

export const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: ${color.greyScale[50]};
`;

export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 85%;
  word-break: break-word;
`;

export const UserMessage = styled.div`
  align-self: flex-end;
  background-color: ${color.skyBlueScale[500]};
  color: white;
  padding: 12px 16px;
  border-radius: 12px 12px 0 12px;
  margin-left: auto;
`;

export const AssistantMessage = styled.div`
  align-self: flex-start;
  background-color: white;
  color: ${color.greyScale[900]};
  padding: 12px 16px;
  border-radius: 12px 12px 12px 0;
  border: 1px solid ${color.greyScale[200]};
  margin-right: auto;
  line-height: 1.5;
`;

export const InputContainer = styled.div`
  display: flex;
  padding: 16px;
  background-color: white;
  border-top: 1px solid ${color.greyScale[200]};
  gap: 10px;
`;

export const TextareaStyled = styled.textarea`
  flex: 1;
  border: 1px solid ${color.greyScale[300]};
  border-radius: 4px;
  padding: 10px 14px;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
  
  &:focus {
    border-color: ${color.skyBlueScale[500]};
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
  
  &:disabled {
    background-color: ${color.greyScale[100]};
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  background-color: ${color.skyBlueScale[500]};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${color.skyBlueScale[700]};
  }
  
  &:disabled {
    background-color: ${color.greyScale[400]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const blink = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

export const LoadingDots = styled.div`
  display: flex;
  
  span {
    animation: ${blink} 1.4s infinite both;
    height: 5px;
    width: 5px;
    margin: 0 2px;
    border-radius: 50%;
    display: inline-block;
    font-size: 24px;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`; 