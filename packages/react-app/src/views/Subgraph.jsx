import { gql, useQuery } from "@apollo/client";
import { Button, Input, Table, Typography } from "antd";
import "antd/dist/antd.css";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import React, { useState } from "react";
import { Address } from "../components";

const highlight = {
  marginLeft: 4,
  marginRight: 8,
  /* backgroundColor: "#f9f9f9", */ padding: 4,
  borderRadius: 4,
  fontWeight: "bolder",
};

function Subgraph(props) {
  const portfolioQuery = `
  {
    portfolios(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      name
      tokens
      createdAt
    }
  }
  `;
  const { loading: portfolioLoading, data: portfolioData } = useQuery(gql(portfolioQuery), { pollInterval: 2500 });

  const balanceQuery = `
  {
    portfolios(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      name
      tokens
      createdAt
    }
  }
  `;
  const { loading: balanceLoading, data: balanceData } = useQuery(gql(balanceQuery), { pollInterval: 2500 });

  const portfolioColumns = [
    {
      title: "Portfolio",
      dataIndex: "id",
      key: "id",
      render: record => <Address value={record} ensProvider={props.mainnetProvider} fontSize={16} />,
    },
    {
      title: "Tokens",
      dataIndex: "tokens",
      key: "tokens",
      render: record => {
        let addressComponents = record.map(assetAddr => {
          return (<Address value={assetAddr} ensProvider={props.mainnetProvider} fontSize={16} />)
        });
        return (<div>{addressComponents}</div>)
      },
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: d => new Date(d * 1000).toISOString(),
    },
  ];

  const balanceColumns = [
    {
      title: "Portfolio",
      dataIndex: "id",
      key: "id",
      render: record => <Address value={record} ensProvider={props.mainnetProvider} fontSize={16} />,
    },
    {
      title: "Tokens",
      dataIndex: "tokens",
      key: "tokens",
      render: record => {
        let addressComponents = record.map(assetAddr => {
          return (<Address value={assetAddr} ensProvider={props.mainnetProvider} fontSize={16} />)
        });
        return (<div>{addressComponents}</div>)
      },
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: d => new Date(d * 1000).toISOString(),
    },
  ];

  const deployWarning = (
    <div style={{ marginTop: 8, padding: 8 }}>Warning: ???? Have you deployed your subgraph yet?</div>
  );

  return (
    <>
      <div style={{padding: '0px 32px'}}>
        {portfolioData ? (
          <Table dataSource={portfolioData.portfolios} columns={portfolioColumns} rowKey="id" />
        ) : (
          <Typography>{portfolioLoading ? "Loading..." : deployWarning}</Typography>
        )}
      </div>
      <div style={{padding: '0px 32px'}}>
        {balanceData ? (
          <Table dataSource={balanceData.balance} columns={balanceColumns} rowKey="id" />
        ) : (
          <Typography>{balanceLoading ? "Loading..." : deployWarning}</Typography>
        )}
      </div>
    </>
  );
}

export default Subgraph;
