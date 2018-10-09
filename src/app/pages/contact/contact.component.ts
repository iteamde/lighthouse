import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../@services/menu.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  lat = -37.8326658;
  lng = 144.9184018;

  styles = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        {
          lightness: '24'
        },
        {
          gamma: '2.86'
        },
        {
          weight: '1.61'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'simplified'
        },
        {
          hue: '#ff0000'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text',
      stylers: [
        {
          color: '#5da2f6'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#5da2f6'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#5da2f6'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#5da2f6'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#5da2f6'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'labels.icon',
      stylers: [
        {
          color: '#5da2f6'
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          color: '#f2f2f2'
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#f6f6f6'
        },
        {
          lightness: '26'
        },
        {
          saturation: '40'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          saturation: -100
        },
        {
          lightness: 45
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9392ef'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#9392ef'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          hue: '#ff00ca'
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          color: '#ffffff'
        },
        {
          visibility: 'on'
        }
      ]
    }
  ];

  constructor(public menuService: MenuService) {}

  ngOnInit() {
    this.menuService.invert = true;
    this.menuService.quoteOpened = false;
  }

  ngOnDestroy() {
    this.menuService.invert = false;
  }
}
