import React from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";

// 仮データ
const items = Array.from({ length: 50 }, (_, i) => `アイテム ${i + 1}`);

const FixedScreenWithList: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // 画面全体に広げる
      }}
    >
      {/* 上部スクロール可能リスト */}
      <Box
        sx={{
          flex: 1, // 残りの高さすべて
          overflowY: "auto", // 縦スクロール
          p: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <List>
          {items.map((item, index) => (
            <ListItem key={index} divider>
              <Typography>{item}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 下部固定ボタン */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
          flexShrink: 0, // スクロールで縮まない
        }}
      >
        <Button variant="contained" fullWidth>
          下部固定ボタン
        </Button>
      </Box>
    </Box>
  );
};

export default FixedScreenWithList;
