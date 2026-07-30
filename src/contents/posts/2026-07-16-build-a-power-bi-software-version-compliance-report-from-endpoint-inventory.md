---
title: "Build a Power BI Software Version Compliance Report from Endpoint Inventory"
description: "Compare installed software versions against latest known versions while avoiding duplicate or pre-filtered source data issues."
date: 2026-07-16
categories: [PowerBI]
tags: [power-bi, dax, power-query, software-inventory, mde]
layout: post
published: true
---

# Build a Power BI Software Version Compliance Report from Endpoint Inventory

## Summary

Software version compliance reporting can become inaccurate when latest-version logic is calculated from a filtered table or when application names are normalized inconsistently across inventory sources.

> This article is intentionally generic and does not include tenant names, device names, user names, internal URLs, domain names, ticket numbers, or customer-specific data.

## Problem

A report needs to show whether devices are running the latest known version of specific software. The inventory contains raw app names from endpoint sources, while a mapping table provides friendly display names.

## Symptoms

- Latest version values are incorrect or duplicated.
- Windows and Linux versions are mixed together.
- App names from one source do not match friendly names in another table.
- Power Query errors occur when a normalization function or column name does not exist.
- Versions like `26.02.00.0` and `26.02.0.0` appear different even though they sort to the same normalized version.

## Root Cause

The latest-version reference table must be built from the raw inventory before endpoint-type filtering removes relevant rows. At the same time, operating system scope must be controlled so Windows is compared only to Windows versions. Version text must also be normalized before comparison.

## Fix

Recommended model pattern:

1. Keep a raw inventory query, for example `ManagedApps_Raw`.
2. Build a dedicated latest-version query from raw inventory.
3. Apply OS filtering intentionally, for example Windows only.
4. Normalize application names consistently.
5. Normalize version values into sortable padded segments.
6. Keep friendly names in a mapping table.
7. Use DAX measures or calculated columns to compare installed version vs latest known version.

Example DAX pattern:

```DAX
Latest Known Version =
VAR CurrentApp =
    SELECTEDVALUE(SoftwareInventory[App Name])
RETURN
    LOOKUPVALUE(
        SoftwareLatestVersions[Latest Version],
        SoftwareLatestVersions[App Name], CurrentApp
    )
```

Example status measure:

```DAX
Version Compliance Status =
VAR Installed = SELECTEDVALUE(SoftwareInventory[Normalized Version])
VAR Latest = SELECTEDVALUE(SoftwareInventory[Latest Known Normalized Version])
RETURN
SWITCH(
    TRUE(),
    ISBLANK(Installed) || ISBLANK(Latest), "Unknown",
    Installed = Latest, "Current",
    Installed < Latest, "Outdated",
    Installed > Latest, "Newer than reference",
    "Unknown"
)
```

## Validation

Validate with known edge cases:

- Apps with multiple OS versions.
- Apps where vendor version formatting differs but normalized version is equal.
- Apps with friendly names that differ from raw inventory names.
- Devices already running the current version.
- Devices with no installed version reported.

## Rollback

If the latest-version logic creates incorrect results:

1. Disable the new measure from report visuals.
2. Revert visuals to installed-version-only reporting.
3. Rebuild the latest-version query from raw inventory.
4. Add a test table showing raw app, friendly app, installed version, normalized version, latest version, and comparison result.

## Notes

Avoid using a filtered enriched table as the source for latest-version calculation if that table removes servers, VDI, Linux devices, or any other systems needed to determine the actual latest known version.

## Sources

- Microsoft Learn: LOOKUPVALUE DAX function: https://learn.microsoft.com/en-us/dax/lookupvalue-function-dax
- Microsoft Learn: DAX reference: https://learn.microsoft.com/en-us/dax/
