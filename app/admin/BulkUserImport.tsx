"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { importUsers } from "../lib/actions";

export function BulkUserImport() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please upload a CSV or Excel file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await importUsers(formData);
      if (result.success) {
        alert("Users imported successfully!");
        setFile(null);
      } else {
        setError(result.error || "An error occurred during import.");
      }
    } catch (error) {
      setError("An unexpected error occurred." + error);
    }
  };

  return (
    <Card className="max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <Input type="file" onChange={handleFileChange} accept=".csv,.xlsx" />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button type="submit" className="mt-4" disabled={!file}>
            Import Users
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
