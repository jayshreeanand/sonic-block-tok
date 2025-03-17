interface EthereumRequestArguments {
  method: string;
  params?: unknown[];
}

interface EthereumProvider {
  request: (args: EthereumRequestArguments) => Promise<unknown>;
  on: (eventName: string, callback: (params: unknown) => void) => void;
  removeListener: (eventName: string, callback: (params: unknown) => void) => void;
  isMetaMask?: boolean;
}

interface Window {
  ethereum?: EthereumProvider;
} 