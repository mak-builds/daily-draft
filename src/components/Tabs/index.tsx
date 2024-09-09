
import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import { ReactElement, useState } from "react";

const TabsComponent = ({ tabsConfig }: { tabsConfig: { label: string, content: ReactElement }[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs variant={"userDetails"} index={activeTab} onChange={setActiveTab}>
      <TabList>
        {tabsConfig.map((tab, index) => (
          <Tab key={index} onClick={() => setActiveTab(index)}>
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabsConfig.map((tab, index) => (
          <TabPanel key={index}>
            {activeTab === index && tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default TabsComponent;
