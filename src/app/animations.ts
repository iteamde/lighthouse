// import the required animation functions from the angular animations module
import {
  trigger,
  query,
  keyframes,
  stagger,
  animate,
  transition,
  style,
  state
} from '@angular/animations';

export let listStagger = trigger('listStagger', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger(
          '50ms',
          animate(
            '550ms ease-out',
            style({ opacity: 1, transform: 'translateY(0px)' })
          )
        )
      ],
      { optional: true }
    )
    //   query(':leave', animate('50ms', style({ opacity: 0 })), {
    //     optional: true
    //   })
  ])
]);

export const fade =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('fade', [
    transition('void => *', [
      style({
        opacity: 0
      }),
      animate(
        '.5s ease-in-out',
        style({
          opacity: 1
        })
      )
    ]),

    transition('* => void', [
      style({
        opacity: 1
      }),
      animate(
        '.5s ease-in-out',
        style({
          opacity: 0
        })
      )
    ])
  ]);

export const fastFade =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('fastFade', [
    transition('void => *', [
      style({
        opacity: 0
      }),
      animate(
        '.2s ease-in-out',
        style({
          opacity: 1
        })
      )
    ]),

    transition('* => void', [
      style({
        opacity: 1
      }),
      animate(
        '.2s ease-in-out',
        style({
          opacity: 0
        })
      )
    ])
  ]);

export const genie =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('genie', [
    transition('void => *', [
      style({
        opacity: 0
      }),
      animate(
        '.2s ease-in-out',
        style({
          opacity: 1,
          top: 0,
          right: 0,
          position: 'fixed'
        })
      )
    ]),

    transition('* => void', [
      style({
        opacity: 1
      }),
      animate(
        '.2s ease-in-out',
        style({
          opacity: 0
        })
      )
    ])
  ]);

export const fadeAnimation = trigger('fadeAnimation', [
  state(
    'small',
    style({
      transform: 'scale(1)'
    })
  ),
  state(
    'large',
    style({
      transform: 'scale(1.2)'
    })
  ),
  transition('small => large', animate('100ms ease-in'))
]);
