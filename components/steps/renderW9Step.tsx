import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const renderW9Step = (formData, errors) => (
  <Card>
    <CardHeader>
      <CardTitle>W-9 Information</CardTitle>
      <CardDescription>Request for Taxpayer Identification Number and Certification.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="w9Name">1. Name (as shown on your income tax return)</Label>
        <Input
          id="w9Name"
          value={formData.w9Name}
          onChange={(e) => updateFormData("w9Name", e.target.value)}
          className={errors.w9Name ? "border-red-500" : ""}
        />
        {errors.w9Name && <p className="text-red-500 text-sm">{errors.w9Name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="w9BusinessName">2. Business name/disregarded entity name, if different from above</Label>
        <Input
          id="w9BusinessName"
          value={formData.w9BusinessName}
          onChange={(e) => updateFormData("w9BusinessName", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>3. Federal tax classification</Label>
        <RadioGroup
          onValueChange={(v) => updateFormData("w9TaxClassification", v)}
          value={formData.w9TaxClassification}
          className={errors.w9TaxClassification ? "border-red-500 rounded-md p-2" : ""}
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual/sole proprietor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="c-corp" id="c-corp" />
              <Label htmlFor="c-corp">C Corporation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="s-corp" id="s-corp" />
              <Label htmlFor="s-corp">S Corporation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partnership" id="partnership" />
              <Label htmlFor="partnership">Partnership</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trust" id="trust" />
              <Label htmlFor="trust">Trust/estate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
            <div className="flex items-center space-x-2 col-span-3">
              <RadioGroupItem value="llc" id="llc" />
              <Label htmlFor="llc">Limited liability company. Enter the tax classification (C, S, or P)</Label>
            </div>
          </div>
        </RadioGroup>
        {errors.w9TaxClassification && <p className="text-red-500 text-sm">{errors.w9TaxClassification}</p>}
        {formData.w9TaxClassification === "llc" && (
          <div className="pl-6 mt-2">
            <Select
              onValueChange={(v: "C" | "S" | "P") => updateFormData("w9LlcClassification", v)}
              value={formData.w9LlcClassification}
            >
              <SelectTrigger className={errors.w9LlcClassification ? "border-red-500" : ""}>
                <SelectValue placeholder="Select LLC classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">C = C corporation</SelectItem>
                <SelectItem value="S">S = S corporation</SelectItem>
                <SelectItem value="P">P = Partnership</SelectItem>
              </SelectContent>
            </Select>
            {errors.w9LlcClassification && <p className="text-red-500 text-sm">{errors.w9LlcClassification}</p>}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="w9Address">5. Address (number, street, and apt. or suite no.)</Label>
        <Input
          id="w9Address"
          value={formData.w9Address}
          onChange={(e) => updateFormData("w9Address", e.target.value)}
          className={errors.w9Address ? "border-red-500" : ""}
        />
        {errors.w9Address && <p className="text-red-500 text-sm">{errors.w9Address}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="w9CityStateZip">6. City, state, and ZIP code</Label>
        <Input
          id="w9CityStateZip"
          value={formData.w9CityStateZip}
          onChange={(e) => updateFormData("w9CityStateZip", e.target.value)}
          className={errors.w9CityStateZip ? "border-red-500" : ""}
        />
        {errors.w9CityStateZip && <p className="text-red-500 text-sm">{errors.w9CityStateZip}</p>}
      </div>
      <div className="space-y-2">
        <Label>Part I: Taxpayer Identification Number (TIN)</Label>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Social Security Number or Employer ID Number"
            value={formData.w9TIN}
            onChange={(e) => updateFormData("w9TIN", e.target.value)}
            className={errors.w9TIN ? "border-red-500" : ""}
          />
          <Select onValueChange={(v: "ssn" | "ein") => updateFormData("w9TINType", v)} value={formData.w9TINType}>
            <SelectTrigger>
              <SelectValue placeholder="Select TIN Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ssn">Social Security Number (SSN)</SelectItem>
              <SelectItem value="ein">Employer Identification Number (EIN)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.w9TIN && <p className="text-red-500 text-sm">{errors.w9TIN}</p>}
      </div>
    </CardContent>
  </Card>
)
