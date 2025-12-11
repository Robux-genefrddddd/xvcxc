# Premium Key Setup Guide

This guide explains how to generate and manage premium activation keys for the PinPinCloud application.

## Overview

The application now supports a premium subscription system with the following features:

- **Free Plan**: 100 MB storage limit
- **Premium Plan**: 1 GB storage limit + priority support
- **Key-Based Activation**: Premium keys in format `PINPIN-XXXX-XXXX-XXXX`

## Setting Up Premium Keys

### Method 1: Using Firebase Console (Recommended for Testing)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "keysystem-d0b86-8df89"
3. Navigate to **Firestore Database**
4. Create a new collection called `premiumKeys`
5. Add a new document with the following structure:

```json
{
  "id": "PINPIN-TEST-0001-0001",
  "created": "2024-01-01T00:00:00Z",
  "used": false,
  "usedBy": null,
  "usedAt": null
}
```

### Method 2: Using a Server Script

Create a `generate-keys.ts` file in your server directory:

```typescript
import { db } from "@/lib/firebase";
import { collection, setDoc, doc } from "firebase/firestore";

export async function generatePremiumKey(): Promise<string> {
  // Generate random parts
  const part1 = generateRandomString(4);
  const part2 = generateRandomString(4);
  const part3 = generateRandomString(4);
  const keyId = `PINPIN-${part1}-${part2}-${part3}`;

  // Save to Firebase
  await setDoc(doc(db, "premiumKeys", keyId), {
    id: keyId,
    created: new Date().toISOString(),
    used: false,
    usedBy: null,
    usedAt: null,
  });

  return keyId;
}

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

## Testing Premium Features

### Testing Premium Upgrade:

1. Log in to the dashboard
2. You'll see a "Plan Status" card showing "Free Plan" with a 100 MB limit
3. Click the "Upgrade" button
4. Enter a premium key in format: `PINPIN-XXXX-XXXX-XXXX`
5. Click "Activate Key"
6. Upon successful validation:
   - A confetti animation will appear
   - The plan will change to "Premium Plan"
   - Storage limit will increase to 1 GB

### Premium Key Validation Rules:

- Format: `PINPIN-[4 chars]-[4 chars]-[4 chars]`
- Each section can contain letters A-Z and numbers 0-9
- The key must exist in the `premiumKeys` Firestore collection
- The key must not have been previously used (`used: false`)

## Key Management

### Checking Key Usage:

In Firebase Console, you can view which keys have been used:

```
premiumKeys/
├── PINPIN-TEST-0001-0001
│   ├── id: "PINPIN-TEST-0001-0001"
│   ├── created: "2024-01-01T00:00:00Z"
│   ├── used: true
│   ├── usedBy: "user-uid-here"
│   └── usedAt: "2024-01-02T10:30:00Z"
```

### Generating Multiple Keys:

You can batch create keys by adding multiple documents to the `premiumKeys` collection:

```
PINPIN-AAAA-BBBB-CCCC
PINPIN-DDDD-EEEE-FFFF
PINPIN-GGGG-HHHH-IIII
PINPIN-JJJJ-KKKK-LLLL
PINPIN-MMMM-NNNN-OOOO
```

## Storage Limits

The application enforces storage limits:

- **Free Plan**: 100 MB per user
- **Premium Plan**: 1 GB per user

The `PlanStatus` component displays:

- Current storage used (calculated from uploaded files)
- Storage limit
- Visual progress bar
- Color-coded warnings (green < 70%, amber 70-90%, red > 90%)

## User Plan Data Structure

User plans are stored in Firestore under the `userPlans` collection:

```json
{
  "userId": "firebase-auth-uid",
  "type": "free" | "premium",
  "storageLimit": 104857600,
  "storageUsed": 25165824,
  "validatedAt": "2024-01-02T10:30:00Z"
}
```

## Troubleshooting

### Key Not Found:

- Ensure the key exists in the `premiumKeys` Firestore collection
- Check for typos in the key format

### Key Already Used:

- Each key can only be used once
- The `used` field will be set to `true` after first use
- Create a new key for another user

### Storage Limit Issues:

- Free plan: 100 MB (102,400 KB)
- Premium plan: 1 GB (1,048,576 KB)
- The app calculates size from file metadata in Firestore

## Next Steps

1. Create at least one premium key in your Firebase console
2. Test the upgrade flow in the dashboard
3. Verify that confetti animation appears
4. Check that the plan status updates correctly
5. Verify that storage limit changes from 100MB to 1GB

## Support

For more information about the plan system implementation, see:

- `client/pages/Dashboard.tsx` - Plan loading and management
- `client/components/dashboard/PlanUpgradeModal.tsx` - Key validation UI
- `client/components/dashboard/PlanStatus.tsx` - Plan display component
