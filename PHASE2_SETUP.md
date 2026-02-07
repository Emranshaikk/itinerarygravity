# Phase 2 Setup Guide

## Step 1: Run Database Migrations

1. Open **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `phase2_schema.sql`
4. Click **Run** or press `Ctrl+Enter`
5. Verify success (should see "Success. No rows returned")

## Step 2: Verify Tables Created

Go to **Table Editor** and confirm these new tables exist:
- ✅ `reviews`
- ✅ `itinerary_analytics`
- ✅ `notification_preferences`

Also verify `itineraries` table has new columns:
- ✅ `average_rating`
- ✅ `review_count`
- ✅ `tags`
- ✅ `duration_days`
- ✅ `difficulty_level`

## Step 3: Test the Features

### Test Search & Filtering:
1. Go to `http://localhost:3000/explore`
2. Try searching for an itinerary
3. Click "Filters" button
4. Select tags and adjust price range
5. Try different sorting options

### Test Creator Analytics:
1. Login as a creator account
2. Go to `http://localhost:3000/dashboard/influencer/analytics`
3. You should see your analytics dashboard
4. If you have itineraries, you'll see metrics

### Test Reviews (via API):
```bash
# Create a review (must be logged in and have purchased the itinerary)
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "itinerary_id": "YOUR_ITINERARY_ID",
    "rating": 5,
    "comment": "Amazing itinerary!"
  }'

# Get reviews for an itinerary
curl http://localhost:3000/api/reviews?itinerary_id=YOUR_ITINERARY_ID
```

## Step 4: Add Sample Data (Optional)

To test with realistic data, add some tags to existing itineraries:

```sql
-- Add tags to itineraries
UPDATE itineraries 
SET tags = ARRAY['Adventure', 'Cultural', '7 Days']::TEXT[],
    duration_days = 7,
    difficulty_level = 'moderate'
WHERE id = 'YOUR_ITINERARY_ID';

-- Add more variety
UPDATE itineraries 
SET tags = ARRAY['Beach', 'Relaxation', '5 Days']::TEXT[],
    duration_days = 5,
    difficulty_level = 'easy'
WHERE id = 'ANOTHER_ITINERARY_ID';
```

## Step 5: Create Test Purchase and Review

1. **Create a test purchase** (in Supabase):
```sql
INSERT INTO purchases (user_id, itinerary_id, amount)
VALUES ('YOUR_USER_ID', 'ITINERARY_ID', 15.00);
```

2. **Create a test review**:
```sql
INSERT INTO reviews (itinerary_id, user_id, rating, comment)
VALUES ('ITINERARY_ID', 'YOUR_USER_ID', 5, 'Excellent itinerary! Highly recommended.');
```

3. **Verify automatic rating update**:
```sql
SELECT id, title, average_rating, review_count 
FROM itineraries 
WHERE id = 'ITINERARY_ID';
```

## Step 6: Test Analytics Tracking

1. Visit an itinerary page
2. The view should be automatically tracked
3. Check analytics:
```sql
SELECT * FROM itinerary_analytics WHERE itinerary_id = 'ITINERARY_ID';
```

## Troubleshooting

### Issue: Tables not created
- **Solution**: Make sure you're running the SQL in the correct project
- Check for error messages in the SQL editor

### Issue: Analytics not showing
- **Solution**: Make sure you have itineraries created
- Verify you're logged in as the creator of those itineraries

### Issue: Can't create review
- **Solution**: Ensure you have a purchase record for that itinerary
- Check that you haven't already reviewed it

### Issue: Ratings not updating
- **Solution**: Verify the trigger was created successfully
- Run this to check:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'update_rating_on_review_change';
```

## Next Steps

Once everything is working:

1. **Add Review UI Components**
   - Create review form component
   - Add to itinerary detail pages
   - Show reviews list

2. **Enhance Analytics**
   - Add date range filters
   - Create charts/visualizations
   - Export functionality

3. **Email Notifications**
   - Set up email service (Resend, SendGrid)
   - Create email templates
   - Add notification triggers

4. **Production Deployment**
   - Run migrations on production database
   - Update environment variables
   - Test all features live

## Quick Reference

### Important URLs:
- Explore: `/explore`
- Creator Analytics: `/dashboard/influencer/analytics`
- Admin Dashboard: `/dashboard/admin`

### API Endpoints:
- Reviews: `/api/reviews`
- Analytics: `/api/analytics`

### Database Functions:
- `increment_itinerary_views(itinerary_uuid)`
- `update_itinerary_rating()` (trigger)
- `update_purchase_analytics()` (trigger)

---

**Need help?** Check `PHASE2_COMPLETE.md` for full documentation.
