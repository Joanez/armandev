---
title: Unified Endpoint Intelligence Dashboard
description: Consolidating Intune, Entra ID, Software Inventory, Update Compliance, and Security Metrics into a Single Power BI Solution
date: 2026-08-25
category: Automation
tags:
  - Power BI
  - Automation
  - Microsoft Intune
  - Entra ID
  - Microsoft Graph
  - Azure Automation
  - Endpoint Management
  - Security
  - Reporting
---

# Unified Endpoint Intelligence Dashboard

## Overview

Modern endpoint management environments generate large amounts of operational, security, compliance, and inventory data. Unfortunately, this information is often spread across multiple administration portals, reporting platforms, and management systems.

Administrators frequently need to switch between different tools to answer basic operational questions:

- Are devices up to date?
- What update rings are currently being deployed?
- Which devices are non-compliant?
- Which applications require updates?
- How many users have adopted passwordless authentication?
- Which devices have enrollment issues?

To address this challenge, I designed and implemented a **Unified Endpoint Intelligence Dashboard**, a centralized reporting solution that consolidates endpoint management, security, software inventory, update compliance, and authentication insights into a single Power BI platform.

The primary objective was to establish a single source of truth for operational reporting while reducing the effort required to gather information from multiple systems.

---

# Business Challenge

Before this solution was implemented, operational reporting required data from several disconnected systems.

Examples included:

- Microsoft Intune
- Microsoft Entra ID
- Microsoft Defender
- Active Directory
- Software lifecycle tracking
- Passwordless adoption reporting
- Device compliance reporting
- Update management reporting

While each platform provided useful information individually, there was no centralized view capable of presenting the overall health of the endpoint environment.

This created several challenges:

- Data silos across multiple management platforms
- Manual reporting efforts
- Reduced visibility for management teams
- Longer investigation times
- Difficulty tracking enterprise-wide trends

The goal was to create a reporting platform that could aggregate this information and provide actionable insights through a single dashboard.

---

# Solution Architecture

The solution uses a hybrid architecture that combines cloud automation, on-premises data extraction, SharePoint storage, and Power BI reporting.


![Architecture](/images/Endpoint_Dashboard/unified-endpoint-intelligence-architecture.png.png)


## Core Components

### Microsoft 365 Data Sources

Cloud-based information is collected from:

- Microsoft Intune
- Microsoft Entra ID
- Microsoft Defender for Endpoint
- Additional Microsoft 365 services when permissions are available

### Azure Automation

Azure Automation is used to:

- Execute scheduled extraction jobs
- Authenticate to approved Microsoft services
- Trigger collection processes
- Generate reporting datasets

### Reporting Ingestion Service

A dedicated ingestion service acts as an intermediary between data collection processes and the reporting repository.

Responsibilities include:

- Data normalization
- Authentication management
- Secure credential handling
- File generation
- Data delivery into SharePoint

### Active Directory Data Collection

Certain information is extracted directly from on-premises Active Directory using PowerShell automation running on a Windows Server.

This allows the reporting platform to combine:

- Cloud identities
- Device information
- Legacy Active Directory attributes

into a single reporting model.

### SharePoint Repository

SharePoint serves as the centralized storage location for reporting datasets.

Benefits include:

- Easy integration with Power BI
- Version control
- Simplified access management
- Centralized storage for automated and manually generated datasets

### Power BI

Power BI is used for:

- Data transformation
- Data modeling
- KPI calculations
- Dashboard visualization
- Scheduled refresh processes

---

# Data Collection Process

The reporting workflow follows these steps:

1. Azure Automation executes scheduled data collection jobs.
2. Approved Microsoft 365 data is extracted using authorized service principals.
3. PowerShell scripts collect on-premises Active Directory data.
4. Data is normalized through the ingestion service.
5. Processed datasets are written to SharePoint.
6. Power BI imports and transforms the data.
7. DAX measures calculate operational metrics.
8. Dashboard pages are refreshed and published.

This architecture creates a centralized reporting platform capable of combining information from multiple systems while maintaining a relatively simple operational footprint.

---

# Automation and Security Constraints

Although many parts of the solution are automated, certain data sources cannot currently be collected automatically due to organizational security controls.

Examples include:

- Certain Microsoft Defender for Endpoint exports
- Secure Boot reporting
- Specific security datasets requiring enhanced API permissions
- Reports requiring restricted Microsoft Graph permissions

Automating these workloads would require:

- Additional Entra ID application registrations
- Additional Microsoft Graph permissions
- Additional Defender API permissions

At the time of implementation, these permissions were not available within the organization's security governance framework.

As a result, some highly restricted datasets are collected through controlled manual exports and placed into the SharePoint repository before being processed by Power BI.

This limitation is not related to Power BI or Azure Automation capabilities but rather to security and governance requirements within the tenant.

The reporting model was intentionally designed so that these data sources can be automated in the future without requiring redesign of the dashboard architecture.

---

# Dashboard Modules

## Windows Update Compliance

Provides visibility into:

- Security update deployment
- Feature update adoption
- Update ring progress
- Compliance status
- Firmware update reporting
- Device update health

./images/windows-update-dashboard.png

---

## Apple Device Security and Update Compliance

Tracks:

- macOS update status
- iPadOS update status
- iOS update status
- Compliance status
- Security patch deployment
- Update ring progress

./images/apple-update-dashboard.png

---

## Android Security Reporting

Provides reporting on:

- Compliance status
- Security update status
- Feature update deployment
- Device activity

./images/android-dashboard.png

---

## Intune Device Intelligence

Delivers operational visibility into:

- Device health
- Device inventory
- Encryption status
- Enrollment issues
- Management status
- Compliance health

./images/intune-dashboard.png

---

## Software Lifecycle Management

This dashboard provides a centralized view of application health across the environment.

Key metrics include:

- Application inventory
- Current packaged versions
- Latest vendor versions
- Risk classification
- Devices behind latest versions
- Application ownership

The result is improved visibility into software lifecycle management and remediation prioritization.

./images/software-dashboard.png

---

## Passwordless Readiness

Tracks organizational adoption of modern authentication technologies including:

- Windows Hello for Business
- Passkeys
- Passwordless authentication
- Adoption by business unit
- Readiness metrics

./images/passwordless-readiness-dashboard.png

---

## Authentication Methods Analytics

Provides insight into how users authenticate across the organization.

Examples include:

- Passkey adoption
- Phone Sign-in usage
- Push notification enrollment
- MFA registration
- Authentication method trends

./images/authentication-methods-dashboard.png

---

# Business Benefits

The solution provides several operational improvements.

## Centralized Visibility

Endpoint administrators no longer need to navigate multiple systems to understand device health and compliance status.

## Reduced Reporting Effort

Data collection and dashboard updates are largely automated, reducing manual reporting activities.

## Improved Decision Making

Leadership teams can consume high-level KPIs while technical teams can drill into operational details.

## Faster Issue Identification

Problems such as:

- Compliance drift
- Update failures
- Enrollment issues
- Software lifecycle gaps

can be identified significantly faster.

## Platform Scalability

The architecture allows new data sources to be integrated over time without redesigning the reporting framework.

---

# Key Lessons Learned

Several key lessons emerged during development:

- Build automation around available security permissions rather than assuming unrestricted API access.
- Separate data extraction from data visualization.
- Normalize data before importing into Power BI.
- Store reporting datasets in a centralized repository.
- Design dashboards for both technical and executive audiences.
- Focus on actionable metrics rather than collecting every available data point.
- Use reusable DAX measures and standardized calculation patterns.
- Expect governance requirements to influence automation decisions.

---

# Future Enhancements

Potential future improvements include:

- Full Microsoft Defender for Endpoint API integration
- Secure Boot automation
- Additional Microsoft Graph integrations
- Expanded vulnerability management reporting
- Automated executive reporting
- Direct API-based ingestion for currently restricted datasets

These improvements can be implemented without significant modifications to the existing reporting model.

---

# Conclusion

The Unified Endpoint Intelligence Dashboard demonstrates how endpoint management, security, software lifecycle management, authentication insights, and compliance reporting can be consolidated into a single operational platform.

By combining Azure Automation, PowerShell, SharePoint, Microsoft 365 services, and Power BI, the solution provides a centralized view of endpoint health while respecting organizational security and governance requirements.

While portions of the data collection process remain intentionally constrained by tenant security policies, the overall architecture is designed to support future automation as additional permissions become available.

The result is a scalable reporting platform that reduces operational overhead, improves visibility, and provides actionable insights across the endpoint ecosystem.

If you're building a similar solution and have questions about architecture, automation, Power Query, DAX modeling, Microsoft Graph integration, or dashboard design, feel free to reach out.