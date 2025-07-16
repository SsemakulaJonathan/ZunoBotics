'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, DollarSign, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Setting {
  key: string;
  value: any;
  type: string;
  label: string;
  description?: string;
  category: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        // Initialize edited values with current values
        const initialValues: Record<string, any> = {};
        Object.keys(data.settings).forEach(key => {
          initialValues[key] = data.settings[key].value;
        });
        setEditedValues(initialValues);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (key: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSetting = async (key: string) => {
    try {
      setIsSaving(true);
      const setting = settings[key];
      const value = editedValues[key];

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          type: setting.type,
          label: setting.label,
          description: setting.description,
          category: setting.category
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the settings state
        setSettings(prev => ({
          ...prev,
          [key]: { ...prev[key], value }
        }));
        toast.success(`${setting.label} updated successfully!`);
      } else {
        throw new Error(data.error || 'Failed to save setting');
      }
    } catch (error) {
      console.error('Failed to save setting:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save setting');
    } finally {
      setIsSaving(false);
    }
  };

  const formatValue = (setting: Setting) => {
    if (setting.type === 'number') {
      return new Intl.NumberFormat('en-US').format(setting.value);
    }
    return setting.value;
  };

  const hasChanges = (key: string) => {
    return editedValues[key] !== settings[key]?.value;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Group settings by category
  const categorizedSettings = Object.keys(settings).reduce((acc, key) => {
    const setting = settings[key];
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push({ key, ...setting });
    return acc;
  }, {} as Record<string, Array<Setting & { key: string }>>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      {Object.keys(categorizedSettings).map(category => (
        <Card key={category} className="w-full">
          <CardHeader>
            <CardTitle className="capitalize">{category} Settings</CardTitle>
            <CardDescription>
              Manage {category} configuration options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {categorizedSettings[category].map(setting => (
              <div key={setting.key} className="space-y-2">
                <Label htmlFor={setting.key} className="text-sm font-medium">
                  {setting.label}
                  {setting.key === 'fundraising_goal' && (
                    <DollarSign className="inline h-4 w-4 ml-1" />
                  )}
                </Label>
                {setting.description && (
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                )}
                <div className="flex gap-2">
                  <Input
                    id={setting.key}
                    type={setting.type === 'number' ? 'number' : 'text'}
                    value={editedValues[setting.key] || ''}
                    onChange={(e) => handleValueChange(
                      setting.key, 
                      setting.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                    )}
                    placeholder={setting.type === 'number' ? '0' : 'Enter value...'}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => saveSetting(setting.key)}
                    disabled={!hasChanges(setting.key) || isSaving}
                    variant={hasChanges(setting.key) ? 'default' : 'outline'}
                    size="sm"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {setting.type === 'number' && editedValues[setting.key] && (
                  <p className="text-xs text-muted-foreground">
                    Formatted: {formatValue({ ...setting, value: editedValues[setting.key] })}
                  </p>
                )}
                {hasChanges(setting.key) && (
                  <Alert>
                    <AlertDescription className="text-xs">
                      You have unsaved changes. Click the save button to apply them.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Alert>
        <AlertDescription>
          Changes to the fundraising goal will be reflected immediately on the donation page. 
          Other settings may require a page refresh to take effect.
        </AlertDescription>
      </Alert>
    </div>
  );
}