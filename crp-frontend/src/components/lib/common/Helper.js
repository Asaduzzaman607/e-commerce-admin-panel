import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import logo from '../../../assets/images/logo.png'

import "../../../assets/fonts/solaimanlipi.js";


export const exportToExcel = (columns, data) => {
    const visibleColumns = columns.filter((col) => col.visible);

    // Function to recursively flatten nested objects
    const flattenData = (item) => {
        const flatItem = {};

        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                if (typeof item[key] === 'object' && item[key] !== null) {
                    // Recursively flatten nested objects
                    const nestedFlat = flattenData(item[key]);
                    for (const nestedKey in nestedFlat) {
                        if (nestedFlat.hasOwnProperty(nestedKey)) {
                            flatItem[`${key}.${nestedKey}`] = nestedFlat[nestedKey];
                        }
                    }
                } else {
                    flatItem[key] = item[key];
                }
            }
        }

        console.log({flatItem})
        return flatItem;
    };

    const exportData = data.map((item) => {
        const flatItem = flattenData(item);

        const rowData = visibleColumns.map((col) => {
            const dataIndex = col.dataIndex;
            const dataIndexArray = Array.isArray(dataIndex) ? dataIndex : [dataIndex]; // Ensure it's an array
            let nestedData = flatItem;

            for (const dataIndexKey of dataIndexArray) {
                const keys = dataIndexKey.split('.'); // Split the key into nested parts
                for (const key of keys) {
                    if (nestedData[key] !== undefined && nestedData[key] !== null) {
                        nestedData = nestedData[key]; // Access nested property
                    } else {
                        nestedData = ''; // Set to an empty string if nested value is undefined or null
                        break; // Exit loop if a nested value is undefined or null
                    }
                }
            }
            console.log({nestedData})
            return nestedData;
        });

        return rowData;
    });


    // Add column titles as the first row in the export data
    const columnTitles = visibleColumns.map((col) => col.title);
    exportData.unshift(columnTitles);

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'datatable-export.xlsx');
};

// export const exportToPDF = (columns,data) => {
//     const doc = new jsPDF();
//     doc.autoTable({
//         head: [columns.map((col) => col.title)],
//         body: data.map((item) => columns.map((col) => item[col.dataIndex])),
//     });
//     doc.save('datatable-export.pdf');
// };

export const exportToPDF = (data, fileName,orientation,title) => {

  let doc;
  if (orientation === 'portrait') {
    doc = new jsPDF('portrait');
  }if(orientation === 'landscape'){
    doc = new jsPDF('landscape');
  }
  
  
  doc.setFont('NotoSansBengali-Regular');
  const headers = Object?.keys(data[0]);
  const rows = data?.map((item) => headers.map((key) => item[key]));
  const centeredContent = title || '';
  doc.setFontSize(25);
  doc.autoTable({
    head: [headers],
    body: rows,
    styles: { font: "NotoSansBengali-Regular"},
    didDrawPage: function (data) {
      doc.setFont('NotoSansBengali-Regular');
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getStringUnitWidth(centeredContent) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const centerX = (pageWidth - textWidth) / 2;
      doc.text(centeredContent, centerX, 10);
    },
  });
  doc.save(fileName);
  };

export const capitalizeString = (inputString, avoidPattern) => {

    if (!Array.isArray(inputString) || inputString.length === 0 || typeof inputString[0] !== 'string') {
        return 'Invalid input';
    }

    const words = inputString[0].split(avoidPattern);
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
}

export const formatMoney = (n) => {
    return  (Math.round(n * 100) / 100).toLocaleString() + "BDT ";
}

export const formatMoneyInMillion =(value)=> {
    if (typeof value !== 'number') {
        return value;
    }

    if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + ' M';
    } else {
        return value.toFixed(2);
    }
}

export const formatUnderLineText = (v) => {
   return  v.charAt(0)?.toUpperCase() + v?.slice(1)?.replace(/_/g, ' ')
}


export function flattenData(data, fieldToPathMapping) {
    return data.map((item) => {
        const flatItem = {};

        for (const field in fieldToPathMapping) {
            const path = fieldToPathMapping[field];
            const keys = path.split('.');
            let nestedData = item;
            for (const key of keys) {
                if (!nestedData || typeof nestedData !== 'object') {
                    nestedData = null;
                    break;
                }
                nestedData = nestedData[key];
            }

            if (nestedData !== null && nestedData !== undefined) {
                flatItem[field] = nestedData;
            } else {
                flatItem[field] = 'N/A';
            }
        }

        return flatItem;
    });
}


export function addEllipsis(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
}

export function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
        month: 'long',
    });
}


export function formatInputDate(inputDate) {
    const [day, month] = inputDate?.split('-')?.map(Number);
    return `${formatWithOrdinal(day)} ${formatWithMonth(month)}`;
}

function formatWithOrdinal(num) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return `${num}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
}

function formatWithMonth(month) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month - 1];
}
