/**
 * Cyber Identity Card Metadata Interface
 * Defines the strict layout data structure for Kampung Siber Retro identity cards
 */

export interface CyberICMetadata {
  /** Unique identification number in Malaysian IC format (e.g., 900123-01-123456) */
  icNumber: string;

  /** Full citizen name as registered in the cyber village system */
  citizenName: string;

  /** Registration date in ISO 8601 format (YYYY-MM-DD) */
  registrationDate: string;

  /** Current active title/role designation within the kampung community */
  activeTitle: string;

  /** Village zone designation indicating residential sector or digital territory */
  villageZone: string;
}

/**
 * Extended metadata interface for comprehensive citizen profiles
 */
export interface CyberICExtendedMetadata extends CyberICMetadata {
  /** Optional avatar emoji or icon representation */
  avatar?: string;

  /** Optional bio/description text */
  bio?: string;

  /** Optional contact or social handle */
  contact?: string;

  /** Registration timestamp for audit purposes */
  registeredAt?: Date;
}

/**
 * Theme configuration for cyber identity card styling
 */
export interface ICThemeConfig {
  /** CSS class for the main card container */
  containerClass: string;

  /** CSS class for the header section */
  headerClass: string;

  /** CSS class for the footer section */
  footerClass: string;

  /** Primary accent color for highlights */
  accentColor: string;

  /** Border style configuration */
  borderStyle: string;
}

/**
 * Default theme configuration for vintage 90s aesthetic
 */
export const DEFAULT_IC_THEME: ICThemeConfig = {
  containerClass: 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-500 rounded-lg shadow-lg',
  headerClass: 'bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-400 font-bold',
  footerClass: 'bg-gray-100 dark:bg-gray-800 px-4 py-2 border-t border-gray-300 dark:border-gray-400 text-xs text-gray-600 dark:text-gray-400',
  accentColor: '#4a5568',
  borderStyle: 'pixel-border'
};

/**
 * Validation utility functions for CyberICMetadata
 */
export const validateICMetadata = (data: CyberICMetadata): boolean => {
  const icPattern = /^\d{6}-\d{2}-\d{6}$/;
  return (
    typeof data.icNumber === 'string' &&
    icPattern.test(data.icNumber) &&
    typeof data.citizenName === 'string' &&
    data.citizenName.length > 0 &&
    typeof data.registrationDate === 'string' &&
    !isNaN(Date.parse(data.registrationDate)) &&
    typeof data.activeTitle === 'string' &&
    typeof data.villageZone === 'string' &&
    data.villageZone.length > 0
  );
};

/**
 * Format helper for displaying IC number in masked format
 */
export const formatICNumber = (icNumber: string): string => {
  if (icNumber.length !== 14) return icNumber;
  return `${icNumber.substring(0, 6)}-${icNumber.substring(6, 8)}-${icNumber.substring(8)}`;
};

/**
 * Get age from IC number (Malaysian format)
 */
export const getAgeFromIC = (icNumber: string): number | null => {
  if (icNumber.length !== 14) return null;
  const birthDateStr = icNumber.substring(0, 6);
  const year = parseInt(birthDateStr.substring(4, 6), 10);
  const month = parseInt(birthDateStr.substring(2, 4), 10);
  const day = parseInt(birthDateStr.substring(0, 2), 10);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  let age = currentYear - year;
  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age--;
  }

  return age > 0 ? age : null;
};