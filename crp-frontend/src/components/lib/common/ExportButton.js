import styled from "styled-components";
import React from 'react';
import * as XLSX from 'xlsx';
import {FileExcelFilled} from "@ant-design/icons";

export const ExportButton = styled.button`
  background-color: rgb(248, 249, 250);
  border: 1px solid rgb(172, 187, 208);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0px 7px;
  margin-left: 2px;
  border-radius: 6px;
  cursor: pointer;
  height: 24px;
`;


const ExportToExcelButton = ({ data, fileName }) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Calculate and set column widths based on the content
        const columnWidths = data?.reduce((acc, row) => {
            Object.keys(row).forEach((key) => {
                const cellValue = row[key]?.toString();
                const columnWidth = cellValue?.length + 2; // Add extra padding
                if (!acc[key] || columnWidth > acc[key]) {
                    acc[key] = columnWidth;
                }
            });
            return acc;
        }, {});

        worksheet['!cols'] = Object.keys(columnWidths).map((key) => ({
            wch: columnWidths[key],
        }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <ExportButton  size="small"  onClick={exportToExcel} >< FileExcelFilled style={{fontSize: "16px", color: "#107C41"}}/> </ExportButton>
    );
};

export default ExportToExcelButton;
