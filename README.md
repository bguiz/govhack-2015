# School of Rock

School of Rock predicts future infrastructure needs,
based on robust data and enhanced statistical visualisation.

We hope that it is used by state and federal governments
in planning for future needs.

At present, we visualise the number of schools needed by "SA2",
from 2015 through to 2060, based on ABS' population growth predictions,
plus a few other data sources.

Drag the slider from left to right to change the year.

Currently, the visualisation only displays New South Wales data
for predicted number of schools needed,
but can be expanded to include:

1. other states, and
2. other types of public infrastructure - e.g. hospitals, roads

In future versions, we plan to add the ability to add a call-to-action,
where you can enter your post code, and from it,
determine your local government representative.
If they have a Twitter account or email address listed publicly,
show a button that tweets, or emails, something along the lines of:

"`We need {numSchools} more schools in {sa2Name} by {year} - have you planned for that {govtRepName}? {url}`"

For example:

"We need 7 more schools in Gordon & Killara by 2030 -
have you planned for that [@PaulFletcherMP](https://twitter.com/PaulFletcherMP)?
[http://t.co/eAVMxLR16D](http://blog.bguiz.com/demo/govhack-2015/client/)"

School of Rock was created as part of
[Govhack 2015](https://www.govhack.org/govhack-2015),
a 48-hour hackathon.

^1 SA2 is a 2nd level "Statistical Area", which are geographical boundaries
   used by the ABS that have a resident population that falls within a certain range.
   They are roughly equivalent to a post code, but are sometimes larger.
   [More details](http://www.abs.gov.au/websitedbs/D3310114.nsf/home/Australian+Statistical+Geography+Standard+%28ASGS%29)

## Demo

View our demo where we predict the number of **schools** needed
here: [**Demo**](http://blog.bguiz.com/demo/govhack-2015/client/)

## How it works

Simply drag the slider to see the forecast infrastructure needs!

## Data sets used

- [ABS](http://abs.gov.au/)
- [ABS.Stat](http://stat.abs.gov.au/)
- [ATO](http://ato.gov.au/)
- [DataNSW](http://abs.gov.au/)
- [NICTA National Map](http://nationalmap.nicta.com.au/)

## Running

To serve the content locally as a static web server:

```bash
npm i -g puer
./run.sh
```

## Team

School of Rock is brought to you by:

- [Tim Paris](https://github.com/paristj)
- [Roslyn Baker](https://github.com/thirstycreative)
- [Brendan Graetz](http://bguiz.com)

## Known issues

- Data
  - Seven of the SA2's have no data available
  - One of the SA2's has is an extreme outlier, and needs verification
- Map
  - Performance issues on mobile devices: Too slow to run on non-Desktop browsers
    - Workaround: Click on a point on the scroll bar instead of dragging it
  - Legend only displays the first two colours

## Contributing

This project uses the [git flow](http://nvie.com/posts/a-successful-git-branching-model/)
branching strategy.
Please branch off **develop** instead of master for any pull requests.

## Licence

GPLv3
