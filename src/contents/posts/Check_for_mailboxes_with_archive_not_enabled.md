---
title: "Identify and Enable Exchange Online Archive Mailboxes"
date: 2026-09-04
author: "Armando Martinez"
excerpt: "Audit Exchange Online archive mailbox adoption, generate compliance reports, identify missing archives, and enable Online Archive mailboxes using PowerShell."
tags:
  - Exchange Online
  - Microsoft 365
  - PowerShell
  - Compliance
  - Email
  - Automation
category: "Microsoft 365"
header_image: "/images/exchange-online/archive-mailbox-audit/header.png"
---

# Identify and Enable Exchange Online Archive Mailboxes

## Overview

Online Archive mailboxes provide organizations with additional mailbox storage while supporting retention, compliance, and long-term email management requirements.

During mailbox audits, it is common to discover users who do not have Online Archive enabled, creating inconsistencies across the environment and potentially impacting retention strategies.

This solution provides a simple way to:

- Audit archive mailbox adoption.
- Export mailbox archive status.
- Identify users missing an Online Archive.
- Generate compliance statistics.
- Enable Online Archive mailboxes individually or in bulk.

---

# Business Scenario

While reviewing Exchange Online configurations, I needed to determine which users had Online Archive enabled and identify mailboxes that were not compliant with our organization's archiving standards.

Instead of manually checking users one at a time, PowerShell was used to audit the entire tenant, generate reports, and quickly enable archives where required.

---

# Requirements

## Module Installation

```powershell
Install-Module ExchangeOnlineManagement -Scope CurrentUser
```

## Connect to Exchange Online

```powershell
Connect-ExchangeOnline
```

---

# Step 1 - Export Archive Status for All Mailboxes

Collect archive information for every mailbox and export the results for further analysis.

```powershell
$mailboxes = Get-Mailbox -ResultSize Unlimited

$mailboxes |
    Select-Object `
        DisplayName,
        UserPrincipalName,
        ArchiveStatus,
        ArchiveState,
        ArchiveGuid |
    Export-Csv ".\Exchange-Online-Archive-Status.csv" -NoTypeInformation
```

### Export Example

| DisplayName | UserPrincipalName | ArchiveStatus |
|------------|-------------------|---------------|
| John Smith | john@contoso.com | Active |
| Jane Doe | jane@contoso.com | None |

This report provides a complete inventory of archive mailbox status across the tenant.

---

# Step 2 - Identify Mailboxes Missing an Archive

Filter the mailbox list to display only users without an active archive mailbox.

```powershell
$mailboxes |
    Where-Object {
        $_.ArchiveStatus -ne "Active" -and
        [IsNullOrWhiteSpace($_.ArchiveGuid.ToString())
    } |
    Select-Object `
        DisplayName,
        UserPrincipalName,
        ArchiveStatus,
        ArchiveState,
        ArchiveGuid
```

### Example Output

```text
DisplayName        : Jane Doe
UserPrincipalName  : jane@contoso.com
ArchiveStatus      : None
ArchiveState       :
ArchiveGuid        :
```

This quickly highlights users requiring remediation.

---

# Step 3 - Generate a Compliance Report

Create a summary showing overall archive mailbox adoption.

```powershell
$total = $mailboxes.Count

$enabled = (
    $mailboxes |
    Where-Object {
        $_.ArchiveStatus -eq "Active" -and
        $_.ArchiveGuid -ne :Empty
    }
).Count

$missing = $total - $enabled

[PSCustomObject]@{
    TotalMailboxes = $total
    ArchiveEnabled = $enabled
    ArchiveMissing = $missing
    Compliance     = "$([math]::Round(($enabled /) * 100,2))%"
}
```

### Sample Output

```text
TotalMailboxes : 1250
ArchiveEnabled : 1180
ArchiveMissing : 70
Compliance     : 94.40%
```

This provides a quick compliance snapshot for management and operational reviews.

---

# Step 4 - Enable Archive for a Specific User

When onboarding users or correcting individual exceptions, enable Online Archive for a specific mailbox.

```powershell
Enable-Mailbox -Identity user@contoso.com -Archive
```

Validate the configuration:

```powershell
Get-Mailbox -Identity user@contoso.com |
    Select-Object `
        DisplayName,
        ArchiveStatus,
        ArchiveState,
        ArchiveGuid
```

Example:

```text
ArchiveStatus : Active
```

---

# Step 5 - Review Users Missing Archives Before Bulk Remediation

Always review the impacted users before making bulk changes.

```powershell
Get-Mailbox -ResultSize Unlimited |
    Where-Object {
        $_.ArchiveStatus -ne "Active" -and
        :IsNullOrWhiteSpace($_.ArchiveGuid.ToString())
    } |
    Select-Object `
        DisplayName,
        UserPrincipalName,
        ArchiveStatus,
        ArchiveGuid
```

This validation step provides an opportunity to exclude service accounts, shared mailboxes, or special-purpose mailboxes if required.

---

# Step 6 - Enable Archives for All Missing Users

After validation, archives can be enabled automatically for all non-compliant mailboxes.

```powershell
Get-Mailbox -ResultSize Unlimited |
    Where-Object {
        $_.ArchiveStatus -ne "Active" -and
        :IsNullOrWhiteSpace($_.ArchiveGuid.ToString())
    } |
    ForEach-Object {
        Enable-Mailbox -Identity $_.UserPrincipalName -Archive
    }
```

This allows organizations to quickly reach archive mailbox compliance across the environment.

---

# Benefits

## Improved Compliance

Supports retention and governance initiatives by ensuring mailboxes have Online Archive enabled.

## Increased Mailbox Capacity

Provides users additional storage without requiring larger primary mailboxes.

## Simplified Administration

Reduces manual mailbox reviews through automation.

## Better Reporting

Produces actionable compliance reports that can be shared with stakeholders.

---

# Operational Recommendations

- Schedule periodic archive mailbox audits.
- Review newly created mailboxes after onboarding.
- Validate archive status during Microsoft 365 health assessments.
- Exclude mailboxes that should not receive Online Archive services.
- Track archive adoption using exported reports.

---

# Conclusion

Online Archive mailboxes are a valuable component of Exchange Online governance and compliance strategies. By automating archive mailbox discovery, reporting, and remediation, administrators can improve storage management, strengthen retention capabilities, and ensure consistency across the Microsoft 365 environment.

## Script Location

```text
Microsoft 365/Exchange Online/
```

## Related Technologies

- Exchange Online
- Microsoft 365
- Exchange Online PowerShell
- Compliance
- Retention Policies
- Online Archive
- Mailbox Management

---

**Author:** Armando Martinez  
**Website:** https://armandev.tech  
**GitHub:** https://github.com/Joanez/m365-cloud-architecture-lab