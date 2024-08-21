import { Component, Input, OnInit } from '@angular/core';
import { PublisherCardComponent } from './publisher-card/publisher-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { URL } from '../../../assets/consts';

export type Publisher = {
  publisher: string;
  domains: Array<Domain>;
};

export type Domain = {
  domain: string;
  desktopAds: number;
  mobileAds: number;
};

@Component({
  selector: 'app-publishers-container',
  standalone: true,
  imports: [PublisherCardComponent, CommonModule, FormsModule],
  templateUrl: './publishers-container.component.html',
  styleUrl: './publishers-container.component.css',
})
export class PublishersContainerComponent implements OnInit {
  isAddPublisher: boolean = false;
  isAddDomain: boolean = false;

  @Input() newPublisher!: Publisher;
  _newPublisher!: Publisher;

  constructor() {}

  data: Array<Publisher> = [];
  async ngOnInit(): Promise<void> {
    const response = await fetch(`${URL}/publishers`);
    const publisherArr: Array<Publisher> = await response.json();

    this.data = publisherArr;
  }

  addPublisher() {
    this.isAddPublisher = true;
    this.newPublisher = JSON.parse(JSON.stringify(this._newPublisher))
  }

  async toggleAddPublisher() {
    this.isAddPublisher = !this.isAddPublisher;
    await fetch(`${URL}/add-publisher`, {
      method: 'POST',
      body: JSON.stringify({publisherName: this.newPublisher.publisher}),
    });
  }

  addDomain() {
    const publisherName = prompt('Enter the publisher name');
    // Find the publisher by name
    const publisher = this.data.find((pub) => pub.publisher === publisherName);

    if (!publisher) {
      alert(`Publisher "${publisherName}" not found.`);
      return;
    }

    // Get new domain information
    const newDomain = prompt('Enter the domain name') || '';
    const desktopAds = parseInt(
      prompt('Enter the number of desktop ads') || '0',
      10
    );
    const mobileAds = parseInt(
      prompt('Enter the number of mobile ads') || '0',
      10
    );

    // Check if the domain already exists in any other publisher
    const existingPublisher = this.data.find(
      (pub) =>
        pub.publisher !== publisherName &&
        pub.domains.some((domain) => domain.domain === newDomain)
    );

    if (existingPublisher) {
      alert(
        `This domain is already configured on publisher "${existingPublisher.publisher}".`
      );
    } else {
      // Add the domain to the publisher
      publisher.domains.push({
        domain: newDomain,
        desktopAds,
        mobileAds,
      });
    }
  }


  toggleAddDomain() {
    this.isAddDomain = !this.isAddDomain;
  }
}
