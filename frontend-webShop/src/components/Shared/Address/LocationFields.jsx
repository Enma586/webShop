import { Label } from "@/components/ui/label";

export const LocationFields = ({ 
    departments, 
    municipalities, 
    formData, 
    onDeptChange, 
    onMuniChange, 
    loadingMunis 
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase opacity-50">Department</Label>
            <select 
                name="department_id"
                value={formData.department_id}
                onChange={(e) => onDeptChange(e.target.value)}
                className="w-full bg-background border border-border h-12 px-4 text-[11px] uppercase font-mono outline-none focus:border-primary text-foreground"
                required
            >
                <option value="">Select Dept</option>
                {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
        </div>
        <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase opacity-50">Municipality</Label>
            <select 
                name="municipality_id"
                value={formData.municipality_id}
                onChange={(e) => onMuniChange(e)}
                className="w-full bg-background border border-border h-12 px-4 text-[11px] uppercase font-mono outline-none focus:border-primary disabled:opacity-30 text-foreground"
                required
                disabled={!formData.department_id || loadingMunis}
            >
                <option value="">{loadingMunis ? "Loading..." : "Select City"}</option>
                {municipalities?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
        </div>
    </div>
);