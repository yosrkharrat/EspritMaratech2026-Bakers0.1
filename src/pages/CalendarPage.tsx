import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "@/components/EventCard";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const events = [
  { title: "Sortie Lac de Tunis", date: "8 Fév", time: "06:30", location: "Lac de Tunis", group: "Groupe A", type: "daily" as const, participants: 18 },
  { title: "Interval training", date: "8 Fév", time: "18:00", location: "Stade El Menzah", group: "Groupe B", type: "daily" as const, participants: 12 },
  { title: "Sortie longue", date: "9 Fév", time: "07:00", location: "Parc Belvédère", group: "Tous", type: "weekly" as const, participants: 45 },
  { title: "Semi-Marathon Carthage", date: "15 Fév", time: "08:00", location: "Carthage", group: "Compétition", type: "race" as const, participants: 32 },
];

const CalendarPage = () => {
  const [currentDate] = useState(new Date(2026, 1)); // Feb 2026
  const [selectedDay, setSelectedDay] = useState(8);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDays = [3, 5, 8, 9, 12, 15, 17, 19, 22, 24, 26];

  return (
    <div className="pb-20 pt-6">
      {/* Header */}
      <div className="px-4 mb-4">
        <h1 className="font-display font-extrabold text-2xl">Calendrier</h1>
        <p className="text-sm text-muted-foreground">Événements et sorties</p>
      </div>

      {/* Calendar */}
      <div className="mx-4 bg-card rounded-2xl rct-shadow-card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-display font-bold">{MONTHS[month]} {year}</h3>
          <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const isSelected = day === selectedDay;
            const hasEvent = eventDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                  isSelected
                    ? "rct-gradient-hero text-primary-foreground rct-glow-blue scale-105"
                    : "hover:bg-muted"
                }`}
              >
                {day}
                {hasEvent && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events for selected day */}
      <div className="px-4">
        <h3 className="font-display font-bold mb-3">
          {selectedDay} {MONTHS[month]}
        </h3>
        <div className="space-y-3">
          {events
            .filter((e) => e.date.startsWith(String(selectedDay)))
            .map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          {events.filter((e) => e.date.startsWith(String(selectedDay))).length === 0 && (
            <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
              <p className="text-muted-foreground text-sm">Aucun événement ce jour</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
