import { Label } from "@/components/ui/label";

export const LocationFields = ({ 
    departments, 
    municipalities, 
    districts, 
    formData, 
    onDeptChange, 
    onMuniChange, 
    onDistChange, 
    loadingMunis,
    loadingDistricts 
}) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 01. DEPARTAMENTO */}
        <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase opacity-60 dark:opacity-40 tracking-widest text-foreground">
                Department
            </Label>
            <select 
                name="department_id"
                value={formData.department_id}
                onChange={(e) => onDeptChange(e.target.value)}
                className="w-full bg-background dark:bg-zinc-950 border border-input h-12 px-4 text-[10px] uppercase font-mono outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground rounded-none appearance-none cursor-pointer hover:bg-accent/50 transition-colors"
                required
            >
                <option value="" className="bg-background text-foreground">Select Dept</option>
                {departments?.map(d => (
                    <option key={d.id} value={d.id} className="bg-background text-foreground">
                        {d.name}
                    </option>
                ))}
            </select>
        </div>

        {/* 02. MUNICIPIO */}
        <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase opacity-60 dark:opacity-40 tracking-widest text-foreground">
                Municipality
            </Label>
            <select 
                name="municipality_id"
                value={formData.municipality_id}
                onChange={(e) => onMuniChange(e)}
                className="w-full bg-background dark:bg-zinc-950 border border-input h-12 px-4 text-[10px] uppercase font-mono outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-30 disabled:cursor-not-allowed text-foreground rounded-none appearance-none cursor-pointer transition-colors"
                required
                disabled={!formData.department_id || loadingMunis}
            >
                <option value="" className="bg-background text-foreground">
                    {loadingMunis ? "Loading..." : "Select City"}
                </option>
                {municipalities?.map(m => (
                    <option key={m.id} value={m.id} className="bg-background text-foreground">
                        {m.name}
                    </option>
                ))}
            </select>
        </div>

        {/* 03. DISTRITO */}
        <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase opacity-60 dark:opacity-40 tracking-widest text-foreground">
                District
            </Label>
            <select 
                name="district_id"
                value={formData.district_id}
                onChange={(e) => onDistChange(e)}
                className="w-full bg-background dark:bg-zinc-950 border border-primary/30 h-12 px-4 text-[10px] uppercase font-mono outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-30 disabled:cursor-not-allowed text-foreground rounded-none appearance-none cursor-pointer transition-colors"
                required
                disabled={!formData.municipality_id || loadingDistricts}
            >
                <option value="" className="bg-background text-foreground">
                    {loadingDistricts ? "Loading..." : "Select District"}
                </option>
                {districts?.map(dist => (
                    <option key={dist.id} value={dist.id} className="bg-background text-foreground">
                        {dist.name}
                    </option>
                ))}
            </select>
        </div>
    </div>
);