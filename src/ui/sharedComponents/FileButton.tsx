import React from "react"

export default function FileButton({ label = "Choose File", onFileSelected }: { label?: String, onFileSelected: (file: File) => void }) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <>
      <button onClick={handleClick}>{ label } </button>

      <input
        type="file"
        ref={fileRef}
        accept="*/*"
        //accept="*.kif"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}
