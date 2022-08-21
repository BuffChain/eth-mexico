import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', padding: "1.2rem" }}>
      <img src='https://tuffdao.io/images/tuff_logo.png' width={64} height={64} style={{
        marginRight: '24px'
      }}
      ></img>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "start" }}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Title level={4} style={{ margin: "0 0.5rem 0 0" }}>
            {title}
          </Title>
        </a>
        <Text type="secondary" style={{ textAlign: "left" }}>
          {subTitle}
        </Text>
      </div>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://tuffdao.io",
  title: "TuffDAO",
  subTitle: "Portfolio and Price Tracking Services for DAOs",
};
