export default function TimeToPetResearchPage() {
  return (
    <>
      <header>
        <p className="research-eyebrow">Competitive Research</p>
        <h1>Time To Pet</h1>
        <p>
          B2B SaaS for pet care businesses — the operational back office
          for walkers, sitters and daycares. Not a competitor to Doggo,
          but their session-experience features are table stakes we
          should borrow from.
        </p>
        <div className="research-meta">
          <span className="research-meta-tag">B2B SaaS</span>
          <span className="research-meta-tag">Back-office for providers</span>
          <span className="research-meta-tag">4,000+ customers</span>
        </div>
      </header>

      <h2>What Time To Pet is</h2>
      <p>
        Back-office software for existing pet care businesses — scheduling,
        staff management, client communication, invoicing, payments. TTP
        assumes you <em>already</em> run a business with clients. Doggo is
        community-first: care emerges from trust built through meets and
        connections. Different category entirely.
      </p>
      <p>
        <strong>Pricing:</strong> $25/mo (Lite solo), $50/mo (Solo advanced),
        $40/mo + $16/active staff (Team). A 10-walker team pays ~$200/mo.
        No long-term contracts.
      </p>

      <h2>Features worth studying</h2>

      <h3>Visit Report Cards — high priority</h3>
      <p>
        After every walk or visit, the walker sends a report card to the
        pet parent. Contains photos, written notes on behaviour and mood,
        a GPS track of the route, time tracking (check-in/check-out
        timestamps), delivered via push / email / SMS.
      </p>
      <p>
        <strong>Why this matters for Doggo:</strong> this is the feature
        that makes pet parents feel safe and delighted. It turns an
        invisible service into a tangible, shareable experience. Our
        &quot;Complete session&quot; action should generate something
        similar — a session summary card with photos, notes, and
        optionally GPS data, becoming the session record visible to the
        owner.
      </p>

      <h3>Real-time walk updates — medium priority</h3>
      <p>
        During an active walk, pet parents can see the walker&apos;s live
        GPS location on a map, receive mid-walk photo updates, and get
        push notifications when the walk starts and ends.
      </p>
      <p>
        A trust accelerator. For anxious owners (the Daniel archetype),
        knowing exactly where their dog is right now reduces anxiety
        enormously. Even for confident owners, it&apos;s a delight feature.
        Full GPS streaming needs real-time infrastructure (Supabase
        Realtime or similar) — but a simpler version (start notification
        + mid-session photo + end notification) captures most of the value.
      </p>

      <h3>Automated recurring scheduling + invoicing — already aligned</h3>
      <p>
        TTP auto-generates invoices from completed services and handles
        recurring schedule templates. Doggo&apos;s rolling weekly billing
        model (<code>billingCycle: &quot;weekly&quot;</code>, one upcoming
        session at a time) is already well-aligned with this pattern. No
        changes needed — good validation that we&apos;re on the right track.
      </p>

      <h3>Staff / provider mobile workflow — medium priority</h3>
      <p>
        TTP&apos;s staff app is purpose-built for field workers: view
        today&apos;s schedule at a glance, access client and pet info
        (keys, alarm codes, medication, vet details), check in/out with
        GPS, complete events and send updates without leaving the app.
      </p>
      <p>
        Doggo&apos;s provider experience lives within the same app as the
        owner experience (the right call — everyone starts as owner, care
        is a dial). But the provider&apos;s <strong>active session</strong>
        {" "}workflow should be equally streamlined — a focused mode
        surfacing only what they need: pet info, session actions, photo
        upload, notes.
      </p>

      <h2>Features that don&apos;t apply to Doggo</h2>
      <ul>
        <li>
          <strong>QuickBooks integration</strong> — Doggo handles payments
          internally; no external accounting sync for the prototype.
        </li>
        <li>
          <strong>Staff payroll reports</strong> — Doggo providers are
          independent, not employees.
        </li>
        <li>
          <strong>Multi-staff scheduling / dispatching</strong> — Doggo
          is 1:1 provider-to-owner, not dispatching teams.
        </li>
        <li>
          <strong>Key / access management</strong> — not relevant for
          Doggo&apos;s care model (primarily walks and daycare, not home
          visits with keys).
        </li>
      </ul>

      <h2>Strategic observations</h2>

      <h3>Doggo&apos;s differentiation</h3>
      <p>
        TTP serves businesses that already exist. Doggo creates care
        providers from community members. The &quot;everyone starts as
        owner, care is a dial&quot; model is fundamentally different —
        there&apos;s no onboarding friction, no business setup, no staff
        overhead. A neighbour who watches your dog twice a week
        doesn&apos;t think of themselves as running a pet care business,
        but they&apos;re providing real value. Doggo captures that.
      </p>

      <h3>The trust gap TTP doesn&apos;t solve</h3>
      <p>
        TTP assumes the client already trusts the business. They found
        the walker through a referral or Google search, and now they
        need operational tooling. Doggo solves the harder problem
        upstream: how do you go from stranger to trusted enough to hand
        over your dog? The community → trust → care funnel is the moat.
      </p>

      <h3>Vietnam / SEA market note</h3>
      <p>
        The Vietnam pet market is booming (~$500M, 12M+ cats and dogs).
        PetBacker is the main platform there. TTP has no SEA
        localisation. If Doggo ever expands beyond Prague, the
        community-first model could be especially compelling in markets
        where trust in strangers is lower and word-of-mouth matters more.
      </p>

      <h2>Action items</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Priority</th>
            <th>Target phase</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Design visit report card for session completion</strong>
              Photos, notes, GPS summary, timestamps sent to owner.
            </td>
            <td>High</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Session start/end push notifications</strong>
              Owner notified when provider starts and completes a session.
            </td>
            <td>High</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Mid-session photo update flow</strong>
              Provider sends photo mid-session; owner sees in real time.
            </td>
            <td>Medium</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Live GPS during active sessions</strong>
              Real-time infrastructure required. Parked for post-demo.
            </td>
            <td>Low</td>
            <td>Post-demo</td>
          </tr>
          <tr>
            <td>
              <strong>Provider in-session focused mode</strong>
              Pet info, quick actions, photo upload, notes — nothing else.
            </td>
            <td>Medium</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Validate rolling weekly billing</strong>
              Already aligned with TTP&apos;s pattern.
            </td>
            <td>Low</td>
            <td>Done</td>
          </tr>
        </tbody>
      </table>

      <h2>References</h2>
      <ul>
        <li>
          <a
            href="https://www.timetopet.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            timetopet.com
          </a>
        </li>
        <li>
          <a
            href="https://www.timetopet.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            TTP pricing
          </a>
        </li>
        <li>
          <a
            href="https://www.timetopet.com/dog-walking-software"
            target="_blank"
            rel="noopener noreferrer"
          >
            TTP dog-walking features
          </a>
        </li>
        <li>
          <a
            href="https://www.capterra.com/p/144329/Time-To-Pet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Capterra reviews
          </a>
        </li>
        <li>
          <a
            href="https://www.softwareadvice.com/kennel/time-to-pet-profile/reviews/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Software Advice reviews
          </a>
        </li>
      </ul>
    </>
  );
}
