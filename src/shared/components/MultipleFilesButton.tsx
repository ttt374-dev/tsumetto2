import React from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, IconButton, ListItemButton } from "@mui/material";
import type { ButtonProps, IconButtonProps, ListItemButtonProps } from "@mui/material";

export type ButtonType = "button" | "icon" | "listItem";

type Props = {
  label?: string;
  onFileSelected: (files: File[]) => void;
  type?: ButtonType; // 追加
  buttonProps?: ButtonProps | IconButtonProps | ListItemButtonProps;
}

export default function MultipleFilesButton({ 
  label = "Choose File",
  onFileSelected,
  type = "button",
  buttonProps
}: Props) {

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files){
      onFileSelected(Array.from(files));
    }
    e.target.value = ""; // 同じファイルを再度選択できるようにリセット
  };

  const renderButton = () => {
    switch (type) {
      case "icon":
        return <IconButton onClick={handleClick} {...(buttonProps as IconButtonProps)}>
          <UploadFileIcon />
        </IconButton>;

      case "listItem":
        return <ListItemButton onClick={handleClick} {...(buttonProps as ListItemButtonProps)}>
          {label}
        </ListItemButton>;

      default:
        return <Button onClick={handleClick} {...(buttonProps as ButtonProps)}>
          {label}
        </Button>;
    }
  };

  return (
    <>
      {renderButton()}
      <input
        type="file"
        ref={fileRef}
        multiple
        accept="*.kif"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}
