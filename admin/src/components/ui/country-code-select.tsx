import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface CountryCodeSelectProps {
  countries: Array<{ countryCodeId: string; callingCode: string; countryName: string; isoCode: string }>
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const getFlagUrl = (isoCode: string): string | null => {
  if (!isoCode || isoCode.length < 2) return null
  const twoLetter = isoCode.slice(0, 2).toLowerCase()
  return `/countryFlags/svg/${twoLetter}.svg`
}

export function CountryCodeSelect({
  countries,
  value,
  onValueChange,
  placeholder = "Code",
  disabled = false,
  className,
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = countries.find((c) => c.countryCodeId === value)
  const selectedFlag = selected ? getFlagUrl(selected.isoCode) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "text-muted-foreground",
            className
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {selectedFlag && <img src={selectedFlag} alt="" className="h-4 w-5 rounded-sm object-cover" />}
              +{selected.callingCode}
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        align="start"
      >
        <Command className="max-h-[40vh] overflow-hidden">
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            {countries.map((country) => {
              const flagUrl = getFlagUrl(country.isoCode)
              return (
                <CommandItem
                  key={country.countryCodeId}
                  value={`${country.countryName} ${country.callingCode} ${country.isoCode}`}
                  onSelect={() => {
                    onValueChange(country.countryCodeId)
                    setOpen(false)
                  }}
                >
                  <span className="flex items-center gap-2">
                    {flagUrl && <img src={flagUrl} alt="" className="h-4 w-5 rounded-sm object-cover" />}
                    +{country.callingCode} {country.countryName}
                  </span>
                  <Check className={cn("ml-auto h-4 w-4", value === country.countryCodeId ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
