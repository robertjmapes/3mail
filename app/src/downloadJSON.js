export function downloadFile(data, filename = "data.json") {
    const jsonStr = JSON.stringify(
      data,
      (_, value) => (typeof value === "bigint" ? value.toString() : value), // convert BigInt → string
      2
    );
  
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
  }
  