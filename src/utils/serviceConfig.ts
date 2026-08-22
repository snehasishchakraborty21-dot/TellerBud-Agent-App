/**
 * Centralized Service Availability Configuration
 * Controls active service enablement across the TellerBud Agent App.
 */

export interface ServiceFeatureConfig {
  id: 'pickup' | 'delivery';
  name: string;
  enabled: boolean;
  comingSoon: boolean;
  comingSoonLabel: string;
  helperText: string;
}

export const SERVICES_CONFIG: Record<'pickup' | 'delivery', ServiceFeatureConfig> = {
  pickup: {
    id: 'pickup',
    name: 'Pickup',
    enabled: true,
    comingSoon: false,
    comingSoonLabel: '',
    helperText: 'Available to receive Customer Pickup requests.',
  },
  delivery: {
    id: 'delivery',
    name: 'Delivery',
    enabled: false,
    comingSoon: true,
    comingSoonLabel: 'Coming Soon',
    helperText: 'Delivery is coming soon.',
  },
};

export const isServiceEnabled = (serviceId: 'pickup' | 'delivery' | string): boolean => {
  if (serviceId === 'pickup') return SERVICES_CONFIG.pickup.enabled;
  if (serviceId === 'delivery') return SERVICES_CONFIG.delivery.enabled;
  return false;
};

export const isServiceComingSoon = (serviceId: 'pickup' | 'delivery' | string): boolean => {
  if (serviceId === 'delivery') return SERVICES_CONFIG.delivery.comingSoon;
  return false;
};

export const getPhase1ActiveService = (): 'pickup' => {
  return 'pickup';
};
