import { useContext } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CurrentFeedContext } from "../libs/contexts/currentFeed";

export default function FeedToggler({ tabs }) {
  const [feed, setFeed] = useContext(CurrentFeedContext);

  const handleChange = (_, newValue) => {
    setFeed(newValue);
  };

  return (
    <Tabs
      value={feed || "global"}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      aria-label="Choose your feed"
    >
      {tabs.map((tab) => (
        <Tab label={tab.label} value={tab.value} key={tab.value} />
      ))}
    </Tabs>
  );
}
