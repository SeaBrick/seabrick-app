"use client";

import React, { ReactElement, useState } from "react";
import TabItem, { TabItemProps } from "./TabItem";

interface TabListProps {
  activeTabIndex?: number;
  children: ReactElement<TabItemProps> | ReactElement<TabItemProps>[];
}

const TabLis: React.FC<TabListProps> = ({ activeTabIndex = 0, children }) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const tabs = React.Children.toArray(children) as React.ReactElement<
    TabItemProps,
    string | React.JSXElementConstructor<any>
  >[];

  const tabBase = "w-full cursor-pointer py-4 transition-all";
  const tabStyles = {
    active: `${tabBase} border-b-4 border-green-600 text-green-600`,
    inactive: `${tabBase} border-b border-gray-500 hover:border-green-400 hover:border-b-4 hover:text-green-500`,
  };

  return (
    <div className="my-4 flex w-full flex-col">
      <div
        className="mb-8 flex w-full text-xl font-extrabold text-gray-500"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <div
            key={`tab-btn-${index}`}
            id={`tab-${tab.props.label}`}
            role="tab"
            aria-controls={`panel-${tab.props.label}`}
            aria-selected={activeTab === index}
            onClick={() => handleTabClick(index)}
            className={
              activeTab == index ? tabStyles.active : tabStyles.inactive
            }
          >
            {tab.props.label}
          </div>
        ))}
      </div>
      {tabs[activeTab]}
    </div>
  );
};

export default TabLis;
