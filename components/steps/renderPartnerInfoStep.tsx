import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const renderPartnerInfoStep = (formData, errors) => (
  <Card>
    <CardHeader>
      <CardTitle>Partner & Business Information</CardTitle>
      <CardDescription>Tell us about you and your business.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Partner Information</h3>
        <div className="space-y-2">
          <Label htmlFor="partnerFullName">Your Full Name</Label>
          <Input
            id="partnerFullName"
            value={formData.partnerFullName}
            onChange={(e) => updateFormData("partnerFullName", e.target.value)}
            className={errors.partnerFullName ? "border-red-500" : ""}
          />
          {errors.partnerFullName && <p className="text-red-500 text-sm">{errors.partnerFullName}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="partnerEmail">Email Address</Label>
            <Input
              id="partnerEmail"
              type="email"
              value={formData.partnerEmail}
              onChange={(e) => updateFormData("partnerEmail", e.target.value)}
              className={errors.partnerEmail ? "border-red-500" : ""}
            />
            {errors.partnerEmail && <p className="text-red-500 text-sm">{errors.partnerEmail}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="partnerPhone">Phone Number</Label>
            <Input
              id="partnerPhone"
              type="tel"
              value={formData.partnerPhone}
              onChange={(e) => updateFormData("partnerPhone", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Home Address</Label>
          <Input
            placeholder="Street Address"
            value={formData.partnerAddress}
            onChange={(e) => updateFormData("partnerAddress", e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="City"
              value={formData.partnerCity}
              onChange={(e) => updateFormData("partnerCity", e.target.value)}
            />
            <Input
              placeholder="State"
              value={formData.partnerState}
              onChange={(e) => updateFormData("partnerState", e.target.value)}
            />
            <Input
              placeholder="Zip Code"
              value={formData.partnerZip}
              onChange={(e) => updateFormData("partnerZip", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Information</h3>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => updateFormData("businessName", e.target.value)}
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="principalName">Name of Principal(s)</Label>
          <Input
            id="principalName"
            value={formData.principalName}
            onChange={(e) => updateFormData("principalName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Business Address</Label>
          <Input
            placeholder="Street Address"
            value={formData.businessAddress}
            onChange={(e) => updateFormData("businessAddress", e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="City"
              value={formData.businessCity}
              onChange={(e) => updateFormData("businessCity", e.target.value)}
            />
            <Input
              placeholder="State"
              value={formData.businessState}
              onChange={(e) => updateFormData("businessState", e.target.value)}
            />
            <Input
              placeholder="Zip Code"
              value={formData.businessZip}
              onChange={(e) => updateFormData("businessZip", e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessPhone">Business Phone</Label>
            <Input
              id="businessPhone"
              type="tel"
              value={formData.businessPhone}
              onChange={(e) => updateFormData("businessPhone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => updateFormData("websiteUrl", e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="federalTaxId">Federal Tax ID</Label>
            <Input
              id="federalTaxId"
              value={formData.federalTaxId}
              onChange={(e) => updateFormData("federalTaxId", e.target.value)}
              className={errors.federalTaxId ? "border-red-500" : ""}
            />
            {errors.federalTaxId && <p className="text-red-500 text-sm">{errors.federalTaxId}</p>}
          </div>
          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select
              onValueChange={(v: "Sole" | "LLC" | "Partnership" | "Corp") => updateFormData("businessType", v)}
              value={formData.businessType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sole">Sole Proprietorship</SelectItem>
                <SelectItem value="LLC">LLC</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Corp">Corporation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)
