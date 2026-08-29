const handleDownloadPdf = (rec: StaffCompensation) => {
    const textContent = `
========================================
PAKISTAN LEGAL UNITED SOCIETY (PLUS)
Official Salary Statement & Payslip
========================================
Staff Member : ${rec.name}
Designation  : ${rec.designation}
Hub & Grant  : ${rec.hub} Hub (${rec.assignedGrant})
Approval     : ${rec.approvalStage}
----------------------------------------
Base Salary  : PKR ${rec.baseSalary.toLocaleString()}
Allowances   : + PKR ${rec.allowance.toLocaleString()}
Tax Deduction: - PKR ${rec.taxDeduction.toLocaleString()}
----------------------------------------
NET PAYABLE  : PKR ${rec.netPay.toLocaleString()}
========================================
Generated via PLUS Operations Portal
    `.trim();

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip_${rec.name.replace(/\s+/g, "_")}_${rec.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSelectedPayslip(null);
  };
