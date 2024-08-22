"use client";

import React from "react";

export interface TabItemProps {
  label: string;
  children: React.ReactNode;
}

const TabItem: React.FC<TabItemProps> = ({ label, children }) => {
  return (
    <div aria-labelledby={`tab-${label}`} id={`panel-${label}`}>
      {children}
    </div>
  );
};

export default TabItem;
