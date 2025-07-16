import crypto from 'crypto';

export interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
}

export interface PesapalOrderRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id?: string;
  billing_address?: {
    email_address: string;
    phone_number?: string;
    country_code?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  redirect_url: string;
  error?: {
    type: string;
    code: string;
    message: string;
    details?: any;
  };
}

export interface PesapalTransactionStatusResponse {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  account_number: string;
  currency: string;
}

class PesapalAPI {
  private config: PesapalConfig;
  private baseUrl: string;

  constructor(config: PesapalConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3';
  }

  private async getAccessToken(): Promise<string> {
    const url = `${this.baseUrl}/api/Auth/RequestToken`;
    
    console.log('Requesting Pesapal token from:', url);
    console.log('Consumer key:', this.config.consumerKey);
    console.log('Environment:', this.config.environment);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.config.consumerKey,
        consumer_secret: this.config.consumerSecret,
      }),
    });

    const data = await response.json();
    console.log('Token response:', data);
    
    // Check if there's an error in the response
    if (data.error) {
      throw new Error(`Pesapal authentication failed: ${data.error.message || data.error.code}`);
    }
    
    if (!data.token) {
      throw new Error('No token received from Pesapal API');
    }
    
    return data.token;
  }

  private generateSignature(method: string, url: string, params: any): string {
    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(this.normalizeParams(params))}`;
    const signingKey = `${encodeURIComponent(this.config.consumerSecret)}&`;
    
    return crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64');
  }

  private normalizeParams(params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return sortedParams;
  }

  async submitOrder(orderRequest: PesapalOrderRequest): Promise<PesapalOrderResponse> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/api/Transactions/SubmitOrderRequest`;

    console.log('Submitting order to:', url);
    console.log('Order request:', JSON.stringify(orderRequest, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderRequest),
    });

    const responseData = await response.json();
    console.log('Submit order response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`Failed to submit order: ${response.statusText} - ${JSON.stringify(responseData)}`);
    }

    return responseData;
  }

  async getTransactionStatus(orderTrackingId: string): Promise<PesapalTransactionStatusResponse> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get transaction status: ${response.statusText}`);
    }

    return await response.json();
  }

  async registerIPN(url: string, ipnType: 'GET' | 'POST' = 'POST'): Promise<any> {
    const token = await this.getAccessToken();
    const apiUrl = `${this.baseUrl}/api/URLSetup/RegisterIPN`;

    console.log('Registering IPN with URL:', url);
    console.log('IPN API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        ipn_type: ipnType,
      }),
    });

    const responseData = await response.json();
    console.log('IPN registration response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`Failed to register IPN: ${response.statusText} - ${JSON.stringify(responseData)}`);
    }

    return responseData;
  }
}

export const createPesapalClient = (): PesapalAPI => {
  const consumerKey = process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_SECRET;
  
  if (!consumerKey || !consumerSecret) {
    console.error('Pesapal credentials missing:', { 
      hasKey: !!consumerKey, 
      hasSecret: !!consumerSecret 
    });
    throw new Error('Pesapal consumer key and secret are required. Please check your live credentials.');
  }

  const config: PesapalConfig = {
    consumerKey: consumerKey.trim(),
    consumerSecret: consumerSecret.trim(),
    environment: 'production', // Use production environment for live credentials
  };

  return new PesapalAPI(config);
};

export const generateOrderId = (): string => {
  return `ZB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatAmount = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};