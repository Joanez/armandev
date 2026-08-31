---
title: "Deploying Custom Microsoft Teams Backgrounds with Microsoft Intune"
date: "2026-08-31"
category: "Intune"
tags: ["Intune", "Microsoft Teams", "Windows", "macOS", "PowerShell", "Branding", "Automation"]
excerpt: "Learn how to deploy and manage corporate Microsoft Teams backgrounds across Windows and macOS devices using Microsoft Intune, reducing manual effort while maintaining consistent branding."
author: "Armando Martinez"
---

# Deploying Custom Microsoft Teams Backgrounds with Microsoft Intune

## Overview

Organizations often want users to present a consistent and professional image during meetings. While Microsoft Teams allows users to upload custom backgrounds manually, managing approved corporate backgrounds across hundreds or thousands of devices can become difficult and time-consuming.

To streamline this process, I developed an Intune-based deployment solution that automatically distributes approved Microsoft Teams backgrounds to both Windows and macOS devices.

The solution eliminates manual installation, simplifies management, and ensures users always have access to company-approved backgrounds.

---

## Environment

- Microsoft Intune
- Microsoft Teams
- Windows 10
- Windows 11
- macOS
- PowerShell
- Shell Scripts
- Enterprise-managed devices

---

## Business Challenge

Before automation, deploying branded Teams backgrounds required users to:

1. Download images manually.
2. Locate the correct Teams folder.
3. Upload backgrounds individually.
4. Repeat the process whenever backgrounds were updated.

This approach created several challenges:

- Inconsistent branding
- User confusion
- Increased support requests
- Manual update processes
- No centralized management

A scalable enterprise solution was required.

---

## Solution

The solution leverages Microsoft Intune to automatically deploy background images directly to Microsoft Teams on managed endpoints.

### High-Level Workflow

```text
Corporate Background Images
            ↓
      Intune Package
            ↓
      Device Deployment
            ↓
 Teams Background Folder
            ↓
 Available in Microsoft Teams
```

/images/intune/teams-backgrounds/teams-backgrounds-architecture.png

---

## Windows Deployment

For Windows devices, the solution uses a Win32 application deployment through Microsoft Intune.

### Deployment Process

1. Package background images.
2. Create deployment and detection scripts.
3. Build a Win32 package.
4. Upload the package to Intune.
5. Assign to the target device group.
6. Deploy silently in the background.

### Features

- Silent installation
- Automated deployment
- Intune reporting support
- Version-based updates
- Detection rule validation

### Benefits

✅ No user interaction required

✅ Consistent corporate branding

✅ Centralized management

✅ Easy future updates

✅ Scalable deployment model

---

## macOS Deployment

For macOS devices, the solution uses Intune shell scripts to deploy background images automatically.

### Deployment Process

1. Upload background files.
2. Create deployment script.
3. Deploy through Intune.
4. Copy images into the Teams background folder.
5. Validate successful installation.

### Features

- Native macOS support
- Automated deployment
- Lightweight implementation
- Easy maintenance

### Benefits

✅ Platform consistency

✅ Reduced administrative effort

✅ Supports Hybrid and cloud-managed environments

✅ Seamless user experience

---

## Version Management

One of the challenges with Teams background deployment is managing updates over time.

To address this, the deployment includes version-aware logic that allows administrators to:

- Deploy new background sets
- Replace outdated images
- Prevent duplicate deployments
- Maintain deployment history
- Simplify troubleshooting

This approach ensures future branding changes can be deployed quickly and consistently across the environment.

---

## Validation

After deployment, verify the following:

### Windows Validation

✅ Intune reports successful installation

✅ Detection rules show success

✅ Background images exist in the Teams folder

✅ Backgrounds appear within Microsoft Teams

---

### macOS Validation

✅ Script deployment completed

✅ Images copied successfully

✅ Teams detects the new backgrounds

✅ End users can select the backgrounds immediately

---

## GitHub Repository

The deployment scripts and implementation examples used for this solution are available on GitHub.

### Repository

[Microsoft Teams Backgrounds Intune Deployment Scripts](https://github.com/Joanez/m365-cloud-architecture-lab/tree/main/Microsoft%20Intune/Teams%20Backgrounds)

The repository contains:

- Windows deployment scripts
- macOS deployment scripts
- Intune packaging examples
- Detection logic
- Deployment documentation
- Sample folder structures

---

## Lessons Learned

Although deploying Teams backgrounds appears straightforward, enterprise deployments introduce additional considerations:

- Different file paths across platforms
- Deployment timing
- Detection logic requirements
- Update management
- User experience optimization

Investing time in automation significantly reduces future administrative effort and creates a more reliable deployment model.

---

## Maintenance Recommendations

To simplify long-term management:

- Store source images in a central repository.
- Maintain version control for deployment packages.
- Standardize image naming conventions.
- Test new background sets before production deployment.
- Document update procedures for support teams.

These practices help ensure consistent and repeatable deployments across the organization.

---

## Conclusion

Microsoft Intune provides an effective platform for managing Microsoft Teams backgrounds at scale across both Windows and macOS devices.

By automating the deployment process, organizations can enforce branding standards, improve user experience, reduce support effort, and simplify ongoing maintenance.

The scripts and deployment examples included in the GitHub repository can be adapted to meet a variety of enterprise requirements and deployment models.