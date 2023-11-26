import { ReactNode } from 'react';

export const PressEnterAble = ({ children, handleSubmit }: { children: ReactNode, handleSubmit: () => void }) => {
    return (
      <div
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}>
          {children}
      </div>
    )
  }