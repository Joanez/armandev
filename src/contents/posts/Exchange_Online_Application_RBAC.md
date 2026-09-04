---
title: "Sending Email Securely with Exchange Online Application RBAC"
date: 2026-09-04
author: "Armando Martinez"
excerpt: "Implement secure application email delivery in Exchange Online using Application RBAC, mailbox-scoped permissions, and modern authentication instead of SMTP relay or shared credentials."
tags:
  - Exchange Online
  - Microsoft 365
  - Security
  - Entra ID
  - PowerShell
  - Application RBAC
  - OAuth
  - Microsoft Graph
category: "Microsoft 365"
header_image: "/images/exchange-online/application-rbac-mail/header.png"
---

# Sending Email Securely with Exchange Online Application RBAC

## Overview

Many applications require the ability to send email notifications, reports, alerts, and automated messages.

The traditional approaches typically involve:

- SMTP Authentication
- SMTP Relay
- Shared mailbox credentials
- Service accounts with stored passwords

While these methods work, they often introduce unnecessary risk and do not align with modern Microsoft 365 security practices.

For this lab, my goal was to explore a more secure solution that eliminates legacy authentication while enforcing the principle of least privilege.

Instead of using SMTP relay, I implemented Exchange Online Application RBAC to allow an application to send mail using a dedicated mailbox while preventing access to every other mailbox in the tenant.

---

# The Challenge

A reporting solution needed to send automated reports using the following mailbox:

```text
pingcastle-report@armandev.tech
```

The simplest option would have been configuring SMTP relay and calling it a day.

However, I wanted to better understand how Exchange Online can secure application access using:

- OAuth authentication
- Microsoft Graph
- Application permissions
- Exchange Online Application RBAC
- Mailbox scoping

The end result is significantly more secure than traditional SMTP-based approaches.

---

# Solution Architecture

```text
Application
      |
      v
Microsoft Graph Mail.Send
      |
      v
Exchange Online Service Principal
      |
      v
Application Mail.Send Role
      |
      v
Custom Management Scope
      |
      v
pingcastle-report@armandev.tech
```

The application receives the Microsoft Graph Mail.Send application permission, which appears broad at first glance.

However, Exchange Online Application RBAC creates a security boundary that limits the application's ability to send mail to only the mailbox defined within the management scope.

---

# Why Not SMTP Relay?

SMTP relay is commonly used for application-generated emails and remains a valid option.

However, I wanted to explore a solution that:

- Uses modern authentication.
- Eliminates service account passwords.
- Supports least-privilege access.
- Provides mailbox-level authorization.
- Aligns with Microsoft's cloud-native security model.

This led me to Exchange Online Application RBAC.

---

# Step 1 - Create an Entra ID Application

Navigate to:

```text
Microsoft Entra Admin Center
│
└── App Registrations
    └── New Registration
```

Example application:

```text
APP-PingCastle-Report-Sender
```

After creation, record:

- Application (Client) ID
- Directory (Tenant) ID

---

# Step 2 - Configure API Permissions

Navigate to:

```text
API Permissions
│
└── Add Permission
    └── Microsoft Graph
        └── Application Permissions
            └── Mail.Send
```

Add:

```text
Mail.Send
```

Grant admin consent after assigning the permission.

## Important

At this point, many administrators stop here.

The Microsoft Graph permission:

```text
Mail.Send
```

allows the application to send email as any user.

This seems highly permissive and would normally represent a security concern.

The purpose of the remaining configuration is to create an Exchange Online security boundary that restricts the application to a single mailbox.

---

# Step 3 - Create a Dedicated Mailbox

Create a mailbox that will be used exclusively for application-generated emails.

Example:

```text
pingcastle-report@armandev.tech
```

Using a dedicated mailbox provides:

- Better auditing
- Easier troubleshooting
- Improved separation of duties
- Reduced security risk

---

# Step 4 - Tag the Mailbox

Connect to Exchange Online:

```powershell
Connect-ExchangeOnline
```

Assign a custom attribute to the mailbox:

```powershell
Set-Mailbox pingcastle-report@armandev.tech `
    -CustomAttribute1 "PingCastleApp"
```

Verify the configuration:

```powershell
Get-Mailbox pingcastle-report@armandev.tech |
Select Name,CustomAttribute1
```

Expected output:

```text
Name                 CustomAttribute1
----                 ----------------
PingCastle Report    PingCastleApp
```

---

# Step 5 - Create a Management Scope

The management scope defines which mailboxes the application can access.

Create a scope that includes only the reporting mailbox.

```powershell
New-ManagementScope `
    -Name "PingCastleMailboxScope" `
    -RecipientRestrictionFilter "CustomAttribute1 -eq 'PingCastleApp'"
```

Verify the scope:

```powershell
Get-ManagementScope "PingCastleMailboxScope"
```

This scope becomes the security boundary enforced by Exchange Online.

---

# Step 6 - Retrieve the Service Principal

Connect to Microsoft Graph:

```powershell
Connect-MgGraph -Scopes "Application.Read.All"
```

Specify the App Registration ID:

```powershell
$AppId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Retrieve the Service Principal:

```powershell
$Sp = Get-MgServicePrincipal `
    -Filter "appId eq '$AppId'"
```

Validate the results:

```powershell
$Sp |
Select DisplayName,AppId,Id
```

---

# Step 7 - Register the Service Principal in Exchange Online

Exchange Online must be aware of the application before RBAC assignments can be made.

Register the Entra Service Principal inside Exchange Online:

```powershell
New-ServicePrincipal `
    -AppId $Sp.AppId `
    -ObjectId $Sp.Id `
    -DisplayName "APP-PingCastle-Report-Sender"
```

Verify registration:

```powershell
Get-ServicePrincipal |
Where-Object {
    $_.AppId -eq $AppId
}
```

---

# Step 8 - Assign the Application Role

Assign the Exchange Online Application Mail.Send role.

```powershell
New-ManagementRoleAssignment `
    -Name "PingCastle-App-SendMail" `
    -Role "Application Mail.Send" `
    -App $Sp.AppId `
    -CustomResourceScope "PingCastleMailboxScope"
```

This is the most important step in the solution.

The role assignment links:

- The application
- The Mail.Send role
- The management scope

Together they restrict what the application can do within Exchange Online.

---

# Step 9 - Validate Authorization

Test the authorization assignment.

```powershell
Test-ServicePrincipalAuthorization `
    -Identity "APP-PingCastle-Report-Sender" `
    -Resource "pingcastle-report@armandev.tech"
```

Expected result:

```text
InScope : True
GrantedPermissions : Application Mail.Send
```

This confirms the application can send mail using the approved mailbox.

---

# Understanding the Security Boundary

One of the most interesting findings during this lab was understanding how Exchange Online Application RBAC works alongside Microsoft Graph permissions.

Without Exchange RBAC:

```text
Mail.Send
```

could allow sending mail as any user.

With Exchange RBAC:

```text
Mail.Send
        +
Management Scope
        +
Application Mail.Send Role
```

the application can only send mail using mailboxes included within the assigned management scope.

In this solution:

```text
pingcastle-report@armandev.tech
```

is the only mailbox authorized for the application.

All other mailboxes remain inaccessible.

This follows Microsoft's least-privilege model while maintaining modern authentication.

---

# Security Benefits

## Principle of Least Privilege

The application receives access only to the mailbox it requires.

## No Stored Passwords

Authentication uses OAuth instead of service account credentials.

## Mailbox-Level Authorization

Exchange Online enforces access restrictions through RBAC.

## Improved Auditing

All application-generated messages originate from a dedicated mailbox.

## Reduced Blast Radius

Even if the application is compromised, access remains limited to the scoped mailbox.

---

# Real-World Use Cases

This design works well for:

- PingCastle reports
- Security reporting
- Monitoring alerts
- Scheduled automation reports
- Compliance notifications
- PowerShell automation
- Internal reporting solutions

---

# Lessons Learned

The original goal was simply sending automated reports through Exchange Online.

SMTP relay would have solved the problem quickly.

Instead, I used the opportunity to learn how Exchange Online Application RBAC works and how Microsoft allows applications to operate securely using mailbox-scoped permissions.

The most valuable takeaway was discovering that a seemingly broad Microsoft Graph permission such as:

```text
Mail.Send
```

does not need to result in broad tenant-wide access.

By combining:

- Microsoft Graph Application Permissions
- Exchange Online Application RBAC
- Custom Management Scopes

it is possible to create a secure, least-privileged architecture that allows applications to send mail only from approved mailboxes.

This approach provides stronger security than traditional SMTP-based solutions while remaining fully cloud-native.

---

# Technologies Used

- Exchange Online
- Microsoft Entra ID
- Microsoft Graph
- PowerShell
- OAuth 2.0
- Application RBAC
- Service Principals
- Exchange Online Management Shell

---

# Script Location

```text
Microsoft 365/Exchange Online/
```

## Related Technologies

- Exchange Online
- Entra ID
- Microsoft Graph
- OAuth
- PowerShell
- Zero Trust
- Least Privilege Access
- Mail Automation

---

**Author:** Armando Martinez  
**Website:** https://armandev.tech  
**GitHub:** (https://github.com/Joanez/m365-cloud-architecture-lab)