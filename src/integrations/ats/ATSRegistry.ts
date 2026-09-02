
import { ATSProvider } from './ATSProvider';
import { GreenhouseProvider } from './mockATSProviders/GreenhouseProvider';
import { LeverProvider } from './mockATSProviders/LeverProvider';
import { atsConfig } from './mockATSData';

class ATSRegistry {
  private providers: Map<string, ATSProvider> = new Map();

  constructor() {
    this.register(new GreenhouseProvider());
    this.register(new LeverProvider());
  }

  /**
   * Registers a new ATS provider instance.
   * @param provider - An object that implements the ATSProvider interface.
   */
  private register(provider: ATSProvider): void {
    if (this.providers.has(provider.name)) {
      console.warn(`[ATSRegistry] Provider "${provider.name}" is already registered. Overwriting.`);
    }
    this.providers.set(provider.name, provider);
  }

  /**
   * Retrieves a provider instance by its unique name.
   * @param name - The name of the provider (e.g., 'greenhouse').
   * @returns The provider instance, or undefined if not found.
   */
  public getProvider(name: string): ATSProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Retrieves the appropriate ATS provider for a given country based on configuration.
   * @param countryCode - The ISO code for the country (e.g., 'IN', 'DE').
   * @returns The configured provider instance, or a default provider, or undefined.
   */
  public getProviderForCountry(countryCode: string): ATSProvider | undefined {
    const providerName = atsConfig.countryProviderMapping[countryCode.toUpperCase()] || atsConfig.defaultProvider;
    if (!providerName) {
      console.warn(`[ATSRegistry] No ATS provider configured for country "${countryCode}" and no default is set.`);
      return undefined;
    }
    const provider = this.getProvider(providerName);
    if (!provider) {
        throw new Error(`[ATSRegistry] Configured provider "${providerName}" is not registered.`);
    }
    return provider;
  }
}

// Singleton instance of the registry
export const atsRegistry = new ATSRegistry();
