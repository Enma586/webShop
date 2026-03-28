import { Plus, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UniversalHeader({ 
  title, 
  subtitle, 
  onActionClick, 
  isAdmin = false,
  searchTerm,
  setSearchTerm,
  onFilterChange,
  onSortClick,
  activeSort
}) {
  return (
    <header className="w-full flex flex-col gap-8 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1 bottom-1 w-2px bg-primary" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
              {title} <span className="text-primary/60">{isAdmin ? "System" : "Series"}</span>
            </h1>
          </div>
        </div>

        {isAdmin && (
          <Button 
            onClick={onActionClick}
            className="h-12 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] px-8 rounded-none hover:opacity-90 transition-all border-none"
          >
            <Plus className="w-4 h-4 mr-2 stroke-[3px]" /> 
            CREATE
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-0 items-center border border-border bg-muted/5 overflow-hidden">
        <div className="relative w-full md:w-96 group border-r border-border">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="SEARCH" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-11 bg-transparent border-none rounded-none font-mono text-[11px] uppercase tracking-widest focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 px-6 rounded-none text-[10px] font-black uppercase tracking-widest gap-2 border-r border-border hover:bg-primary/10">
                <Filter size={14} /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-none border-border bg-background min-w-200px">
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest" onClick={() => onFilterChange("ALL")}>ALL_RESOURCES</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest" onClick={() => onFilterChange("ACTIVE")}>ONLY_ACTIVE</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest" onClick={() => onFilterChange("OUT_OF_STOCK")}>OUT OF STOCK</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 px-6 rounded-none text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/10 transition-colors">
                <SlidersHorizontal size={14} /> 
                {activeSort ? `SORT:${activeSort.key}` : "SORT BY"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-none border-border bg-background min-w-200px">
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest" onClick={() => onSortClick('name')}>BY NAME</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest" onClick={() => onSortClick('price')}>BY VALUE</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest" onClick={() => onSortClick('stock')}>BY VOLUME</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto hidden lg:flex items-center gap-4 pr-6 opacity-40">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em]">
            Terminal: <span className="text-primary">Operational</span>
          </span>
        </div>
      </div>
    </header>
  );
}