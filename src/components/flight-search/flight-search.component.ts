import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../lib/shared/calendar/calendar.component';
import { PriceCalendarComponent } from '../price-calendar/price-calendar.component';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar.component';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService, Flight, FlightSearchParams, FlightSearchResponse } from '../../services/flight.service';

interface FilterOptions {
  escales: string[];
  heuresDepart: { min: number; max: number };
  dureeVoyage: { min: number; max: number };
}

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CalendarComponent, 
    PriceCalendarComponent, 
    FilterSidebarComponent, 
    FlightCardComponent
  ],
  template: `
    <!-- Landing Page View -->
    <div *ngIf="!hasSearched()" class="bg-slate-800 min-h-screen">
      <!-- Header -->
      <div class="bg-slate-800 px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              <span class="text-white text-xl font-bold">Skyscanner</span>
            </div>
            <div class="flex items-center space-x-4 text-white text-sm">
              <span class="cursor-pointer hover:text-blue-300">Help</span>
              <span class="cursor-pointer hover:text-blue-300">🌐</span>
              <span class="cursor-pointer hover:text-blue-300">❤️</span>
              <span class="cursor-pointer hover:text-blue-300">👤</span>
              <span class="cursor-pointer hover:text-blue-300">Log in</span>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex space-x-4 mb-8">
            <div class="nav-tab active">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              Flights
            </div>
            <div class="nav-tab inactive">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
              </svg>
              Hotels
            </div>
            <div class="nav-tab inactive">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              Car hire
            </div>
          </div>

          <!-- Main Heading -->
          <div class="mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
              Millions of cheap flights. One simple search.
            </h1>
          </div>

          <!-- Trip Type Selector -->
          <div class="mb-6">
            <div class="inline-flex bg-slate-700 rounded-lg p-1">
              <button class="px-4 py-2 rounded-md bg-slate-600 text-white text-sm font-medium">
                Return
                <svg class="w-4 h-4 ml-1 inline" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Form -->
          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
            <div class="search-input-group">
              <div class="search-input-label">From</div>
              <input
                type="text"
                [(ngModel)]="searchParams().ville_depart"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country, city or airport"
              />
            </div>

            <div class="swap-button lg:block hidden">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>

            <div class="search-input-group">
              <div class="search-input-label">To</div>
              <input
                type="text"
                [(ngModel)]="searchParams().ville_arrivee"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country, city or airport"
              />
            </div>

            <div class="search-input-group">
              <div class="search-input-label">Depart</div>
              <button 
                type="button" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                (click)="openCalendar('depart')"
              >
                {{ searchParams().date_depart || 'Depart date' }}
              </button>
            </div>

            <div class="search-input-group">
              <div class="search-input-label">Return</div>
              <button 
                type="button" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                (click)="openCalendar('return')"
              >
                {{ searchParams().date_retour || 'Add date' }}
              </button>
            </div>

            <div class="search-input-group">
              <div class="search-input-label">Travellers and cabin class</div>
              <button 
                type="button" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {{ searchParams().travellers.adults }} Adult, {{ searchParams().travellers.cabinClass }}
              </button>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="flex flex-wrap gap-4 mb-8 text-sm text-white">
            <label class="flex items-center">
              <input type="checkbox" class="mr-2 rounded">
              Add nearby airports
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2 rounded">
              Add nearby airports
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2 rounded">
              Direct flights
            </label>
          </div>

          <!-- Search Button -->
          <div class="flex justify-center mb-8">
            <button
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-16 py-4 rounded-lg transition-colors duration-200"
              (click)="searchFlights()"
              [disabled]="isLoading() || !isSearchValid()"
            >
              <span *ngIf="!isLoading()">Search</span>
              <span *ngIf="isLoading()" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            </button>
          </div>

          <!-- Price Tracking Banner -->
          <div class="flex items-center justify-between bg-slate-700 rounded-lg p-4">
            <div class="flex items-center text-white">
              <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Access price tracking features to help you save</span>
            </div>
            <button class="bg-white text-slate-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Log in
            </button>
          </div>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="relative">
        <div class="h-96 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 flex items-center justify-center">
          <div class="text-center text-white">
            <h2 class="text-3xl font-bold mb-4">Explore every destination</h2>
            <button class="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Search flights everywhere
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Booking flights with Skyscanner</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">How does Skyscanner work?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">How can I find the cheapest flight using Skyscanner?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">Where should I book a flight to right now?</h3>
              </div>
            </div>
            <div class="space-y-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">Does Skyscanner do hotels too?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">What about car hire?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">What's a Price Alert?</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Page View -->
    <div *ngIf="hasSearched()" class="bg-gray-50 min-h-screen">
      <!-- Header with Search Summary -->
      <div class="bg-blue-900 px-4 sm:px-6 lg:px-8 py-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-blue-600 p-2 rounded mr-4">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <div class="text-white">
                <span class="font-medium">Paris (Tous) - Djerba (DJE) • 1 adulte, Économie</span>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-white text-sm">Vos destinations</div>
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <div class="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Price Calendar -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="flex items-center justify-center space-x-1 overflow-x-auto">
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <div class="text-xs font-medium mb-1">4 mars</div>
              <div class="text-sm font-bold">94 €</div>
            </div>
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <div class="text-xs font-medium mb-1">5 mars</div>
              <div class="text-sm font-bold">94 €</div>
            </div>
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <div class="text-xs font-medium mb-1">6 mars</div>
              <div class="text-sm font-bold">94 €</div>
            </div>
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 selected bg-blue-900 text-white border-blue-900 cursor-pointer">
              <div class="text-xs font-medium mb-1">7 mars</div>
              <div class="text-sm font-bold">79 €</div>
            </div>
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <div class="text-xs font-medium mb-1">8 mars</div>
              <div class="text-sm font-bold">106 €</div>
            </div>
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 text-blue-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <div class="text-xs font-medium mb-1">9 mars</div>
              <div class="text-sm font-bold">85 €</div>
            </div>
            <div class="price-tab min-w-0 flex-shrink-0 px-4 py-3 rounded text-center transition-all duration-200 text-blue-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <div class="text-xs font-medium mb-1">10 mars</div>
              <div class="text-sm font-bold">82 €</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Filter Sidebar -->
          <div class="lg:col-span-3">
            <app-filter-sidebar 
              (filtersChanged)="applyFilters($event)"
            ></app-filter-sidebar>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-6">
            <!-- Price Alert and Sort Section -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"/>
                </svg>
                <span class="text-sm font-medium text-gray-900 mr-4">Recevoir des alertes prix</span>
                <span class="text-sm text-gray-600">44 résultats</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm text-gray-600 mr-2">Trier par</span>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900 mr-2">Le meilleur</span>
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Sort Options Cards -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-blue-900 text-white p-4 rounded-lg text-center">
                <div class="text-sm font-medium mb-1">Le meilleur</div>
                <div class="text-xl font-bold">79 €</div>
                <div class="text-xs opacity-75">2 h 55</div>
              </div>
              <div class="bg-gray-100 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-200">
                <div class="text-sm font-medium text-gray-600 mb-1">Le moins cher</div>
                <div class="text-xl font-bold text-gray-900">79 €</div>
                <div class="text-xs text-gray-500">2 h 55</div>
              </div>
              <div class="bg-gray-100 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-200">
                <div class="text-sm font-medium text-gray-600 mb-1">Le plus rapide</div>
                <div class="text-xl font-bold text-gray-900">96 €</div>
                <div class="text-xs text-gray-500">2 h 50</div>
              </div>
            </div>

            <!-- Flight Cards -->
            <div class="space-y-4" *ngIf="filteredFlights().length > 0">
              <!-- First Flight Card -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="text-sm text-gray-600 font-medium mb-3">Transavia France</div>
                    
                    <div class="flex items-center space-x-6">
                      <!-- Departure -->
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-900">12:35</div>
                        <div class="text-xs text-gray-600 font-medium">ORY</div>
                      </div>

                      <!-- Flight Duration and Route -->
                      <div class="flex-1 flex flex-col items-center">
                        <div class="text-xs text-gray-500 mb-1">2 h 55</div>
                        <div class="w-full flex items-center justify-center relative">
                          <div class="h-px bg-gray-300 flex-1"></div>
                          <svg class="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                          </svg>
                          <div class="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div class="text-xs text-green-600 mt-1 font-medium bg-green-100 px-2 py-1 rounded">Direct</div>
                      </div>

                      <!-- Arrival -->
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-900">15:30</div>
                        <div class="text-xs text-gray-600 font-medium">DJE</div>
                      </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="mt-3 flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span>Aucun bagage en soute inclus</span>
                    </div>
                  </div>

                  <!-- Price and Action -->
                  <div class="ml-6 text-right flex flex-col items-end">
                    <div class="flex items-center mb-2">
                      <div class="text-xs text-gray-500 mr-2">13 offres dès</div>
                      <button class="text-gray-400 hover:text-red-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 mb-2">79 €</div>
                    <button class="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded font-medium transition-colors flex items-center">
                      Voir
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    <div class="text-xs text-gray-500 mt-2 text-center">
                      Non-remboursable<br>
                      Échangeable moyennant des frais
                    </div>
                  </div>
                </div>
              </div>

              <!-- Second Flight Card -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="text-sm text-gray-600 font-medium mb-3">Transavia France</div>
                    
                    <div class="flex items-center space-x-6">
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-900">14:55</div>
                        <div class="text-xs text-gray-600 font-medium">ORY</div>
                      </div>
                      <div class="flex-1 flex flex-col items-center">
                        <div class="text-xs text-gray-500 mb-1">2 h 55</div>
                        <div class="w-full flex items-center justify-center relative">
                          <div class="h-px bg-gray-300 flex-1"></div>
                          <svg class="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                          </svg>
                          <div class="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div class="text-xs text-green-600 mt-1 font-medium bg-green-100 px-2 py-1 rounded">Direct</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-900">17:50</div>
                        <div class="text-xs text-gray-600 font-medium">DJE</div>
                      </div>
                    </div>
                    <div class="mt-3 flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span>Aucun bagage en soute inclus</span>
                    </div>
                  </div>
                  <div class="ml-6 text-right flex flex-col items-end">
                    <div class="flex items-center mb-2">
                      <div class="text-xs text-gray-500 mr-2">13 offres dès</div>
                      <button class="text-gray-400 hover:text-red-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 mb-2">79 €</div>
                    <button class="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded font-medium transition-colors flex items-center">
                      Voir
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    <div class="text-xs text-gray-500 mt-2 text-center">
                      Non-remboursable<br>
                      Échangeable moyennant des frais
                    </div>
                  </div>
                </div>
              </div>

              <!-- Third Flight Card -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="text-sm text-gray-600 font-medium mb-3">Nouvelair</div>
                    
                    <div class="flex items-center space-x-6">
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-900">13:05</div>
                        <div class="text-xs text-gray-600 font-medium">CDG</div>
                      </div>
                      <div class="flex-1 flex flex-col items-center">
                        <div class="text-xs text-gray-500 mb-1">2 h 50</div>
                        <div class="w-full flex items-center justify-center relative">
                          <div class="h-px bg-gray-300 flex-1"></div>
                          <svg class="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                          </svg>
                          <div class="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div class="text-xs text-green-600 mt-1 font-medium bg-green-100 px-2 py-1 rounded">Direct</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-bold text-gray-900">15:55</div>
                        <div class="text-xs text-gray-600 font-medium">DJE</div>
                      </div>
                    </div>
                    <div class="mt-3 flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span>Aucun bagage en soute inclus</span>
                    </div>
                  </div>
                  <div class="ml-6 text-right flex flex-col items-end">
                    <div class="flex items-center mb-2">
                      <div class="text-xs text-gray-500 mr-2">12 offres dès</div>
                      <button class="text-gray-400 hover:text-red-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 mb-2">96 €</div>
                    <button class="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded font-medium transition-colors flex items-center">
                      Voir
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    <div class="text-xs text-gray-500 mt-2 text-center">
                      Non-remboursable<br>
                      Échangeable moyennant des frais
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div *ngIf="filteredFlights().length === 0 && !isLoading()" class="text-center py-12">
              <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun vol trouvé</h3>
              <p class="text-gray-600">Essayez de modifier vos critères de recherche.</p>
            </div>
          </div>

          <!-- Right Sidebar Content -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Hotel Finder -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Vous avez trouvé votre vol ? Trouvez maintenant votre hôtel</h3>
              <p class="text-sm text-gray-600 mb-4">Accédez aux résultats des meilleurs sites d'hôtels ici, sur Skyscanner.</p>
              <button class="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                Découvrir les hôtels
              </button>
              <div class="text-xs text-gray-500 mt-2 text-center">ven. 7 mars-sam. 8 mars</div>
            </div>

            <!-- Car Rental -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Location de voiture à Djerba</h3>
              <p class="text-sm text-gray-600 mb-4">Ne vous arrêtez pas aux vols, trouvez également de bonnes affaires sur les véhicules.</p>
              <div class="bg-blue-600 rounded-lg p-4 flex items-center justify-between">
                <div class="text-white">
                  <div class="text-sm font-medium">Location de voiture dès</div>
                  <div class="text-lg font-bold">24 € par jour</div>
                </div>
                <div class="w-16 h-12 bg-blue-500 rounded flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
              </div>
              <button class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Modal -->
    <div 
      *ngIf="showCalendar()"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      (click)="showCalendar.set(false)"
    >
      <div (click)="stopPropagation($event)" class="w-full max-w-md">
        <app-calendar 
          [initialDate]="getInitialDate()"
          (dateSelected)="onDateSelected($event)"
          (cancelled)="showCalendar.set(false)"
        ></app-calendar>
      </div>
    </div>
  `,
  styles: [`
    .nav-tab {
      @apply flex items-center px-4 py-2 rounded-md text-sm font-medium text-white hover:text-blue-300;
    }

    .nav-tab.active {
      @apply bg-slate-600;
    }

    .nav-tab.inactive {
      @apply text-gray-400;
    }

    .search-input-group {
      @apply relative;
    }

    .search-input-label {
      @apply text-xs text-gray-600 mb-1;
    }

    .swap-button {
      @apply flex items-center justify-center bg-white p-2 border border-gray-300 rounded-md;
    }

    .btn-primary {
      @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
    }

    .flight-card {
      @apply bg-white rounded-lg border border-gray-200 p-4;
    }
  `]
})
export class FlightSearchComponent {
  searchParams = signal<any>({
    ville_depart: '',
    ville_arrivee: '',
    date_depart: '',
    date_retour: '',
    travellers: { adults: 1, cabinClass: 'Economy' }
  });
  showCalendar = signal(false);
  calendarType = signal<'depart' | 'return' | null>(null);
  isLoading = signal(false);
  searchResults = signal<FlightSearchResponse | null>(null);
  errorMessage = signal<string | null>(null);
  hasSearched = signal(false);
  filters = signal<FilterOptions>({
    escales: ['direct', '1', '2+'],
    heuresDepart: { min: 0, max: 1439 },
    dureeVoyage: { min: 180, max: 2640 }
  });

  constructor(private flightService: FlightService) {}

  openCalendar(type: 'depart' | 'return') {
    this.calendarType.set(type);
    this.showCalendar.set(true);
  }

  getInitialDate(): Date {
    const type = this.calendarType();
    const dateStr = type === 'depart' ? this.searchParams().date_depart : this.searchParams().date_retour;
    return dateStr ? new Date(dateStr) : new Date();
  }

  onDateSelected(date: string) {
    const type = this.calendarType();
    if (type === 'depart') {
      this.searchParams.update(params => ({ ...params, date_depart: date }));
    } else if (type === 'return') {
      if (!this.searchParams().date_depart) {
        this.errorMessage.set('Please select departure date first.');
        this.showCalendar.set(false);
        return;
      }
      const departDate = new Date(this.searchParams().date_depart);
      const returnDate = new Date(date);
      if (returnDate <= departDate) {
        this.errorMessage.set('Return date must be after departure date.');
        this.showCalendar.set(false);
        return;
      }
      this.searchParams.update(params => ({ ...params, date_retour: date }));
    }
    this.showCalendar.set(false);
  }

  onPriceDateSelected(date: string) {
    this.searchParams.update(params => ({ ...params, date_depart: date }));
    this.searchFlights();
  }

  applyFilters(newFilters: FilterOptions) {
    this.filters.set(newFilters);
  }

  searchFlights() {
    if (!this.searchParams().ville_depart || !this.searchParams().ville_arrivee || !this.searchParams().date_depart || !this.searchParams().date_retour) {
      this.errorMessage.set('Veuillez remplir tous les champs (départ, arrivée, date de départ et date de retour).');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.flightService.searchFlights(this.searchParams()).subscribe({
      next: (response) => {
        this.searchResults.set(response);
        this.hasSearched.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        this.isLoading.set(false);
        console.error('Search error:', error);
      }
    });
  }

  filteredFlights(): Flight[] {
    const results = this.searchResults()?.flights || [];
    const filters = this.filters();

    return results.filter(flight => {
      const isEscalesMatch = filters.escales.includes(flight.direct ? 'direct' : flight.escales.toString() + '+');
      const departureMinutes = this.parseTimeToMinutes(flight.heure_depart);
      const isTimeMatch = departureMinutes >= filters.heuresDepart.min && departureMinutes <= filters.heuresDepart.max;
      const durationMinutes = this.parseTimeToMinutes(flight.temps_trajet);
      const isDurationMatch = durationMinutes >= filters.dureeVoyage.min && durationMinutes <= filters.dureeVoyage.max;

      return isEscalesMatch && isTimeMatch && isDurationMatch;
    });
  }

  private parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  }

  isSearchValid(): boolean {
    return !!this.searchParams().ville_depart && !!this.searchParams().ville_arrivee && !!this.searchParams().date_depart && !!this.searchParams().date_retour;
  }

  getSearchSummary(): string {
    const params = this.searchParams();
    return `${params.ville_depart} - ${params.ville_arrivee} • ${params.travellers.adults} adulte, ${params.travellers.cabinClass}`;
  }

  goBack(): void {
    this.hasSearched.set(false);
    this.searchResults.set(null);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}