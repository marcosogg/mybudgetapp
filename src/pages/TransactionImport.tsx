import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { FileUpload } from "@/components/transactions/import/FileUpload";
import { CSVPreview } from "@/components/transactions/import/CSVPreview";
import { ImportProgress } from "@/components/transactions/import/ImportProgress";
import { useCSVImport } from "@/components/transactions/import/hooks/useCSVImport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

const TransactionImport = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();
  const {
    file,
    previewData,
    error,
    isProcessing,
    totalRows,
    processedRows,
    isComplete,
    handleFileChange,
    processFile,
  } = useCSVImport();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile?.statement_format) {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          Please set your statement format in the{" "}
          <span 
            className="text-primary cursor-pointer underline" 
            onClick={() => navigate("/settings")}
          >
            settings page
          </span>{" "}
          before importing transactions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Import Transactions</h2>
        <p className="text-muted-foreground">
          Import your transactions from a CSV file
        </p>
      </div>

      <Alert>
        <AlertDescription className="flex items-center gap-2">
          Current import type:{" "}
          <Badge variant="outline" className="text-sm">
            {profile.statement_format.toUpperCase()}
          </Badge>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUpload
              onFileChange={handleFileChange}
              error={error}
              file={file}
            />

            {file && !error && (
              <CSVPreview
                headers={['Date', 'Description', 'Amount']}
                previewData={previewData}
                totalRows={totalRows}
                onProcess={processFile}
                isProcessing={isProcessing}
              />
            )}

            {isProcessing && (
              <ImportProgress
                totalRows={totalRows}
                processedRows={processedRows}
                isComplete={isComplete}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionImport;